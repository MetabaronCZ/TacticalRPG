import React from 'react';

import Animation from 'core/animation';
import * as ArrayUtils from 'core/array';
import * as NumberUtils from 'core/number';

import * as config from 'data/game-config';
import StatusEffects from 'data/status-effects';

import Game from 'modules/game';
import Order from 'modules/order';
import Skill from 'modules/skill';
import Damage from 'modules/damage';
import Position from 'modules/position';
import Character from 'modules/character';
import CharacterActions from 'modules/character-action';

import { PlayerType } from 'modules/player/types';
import { IPosition } from 'modules/position/types';
import { SkillTarget } from 'modules/skill/attributes';
import { WeaponSkillID } from 'modules/skill/weapon/types';
import { ICharacterData } from 'modules/character-data/types';
import { ArchetypeSkillID } from 'modules/skill/archetype/types';
import { IGameState, GamePhase, ActPhase } from 'modules/game/types';
import { getShortestPath, getMovableTiles } from 'modules/pathfinding';
import { IActions, ActionID, IActionItem } from 'modules/character-action/types';

import { IPartyData } from 'engine/party-data';
import { IBattleConfig } from 'engine/battle-config';

import BattleUI from 'ui/battle/BattleUI/template';

const directAction = CharacterActions.directAction;

interface IBattleUIContainerProps {
	readonly parties: IPartyData[];
	readonly characters: ICharacterData[];
	readonly config: IBattleConfig;
	readonly onSummary: () => void;
	readonly onExit: () => void;
}

class BattleUIContainer extends React.Component<IBattleUIContainerProps, IGameState> {
	private initiative = (Math.random() < 0.5 ? PlayerType.ALLY : PlayerType.ENEMY);

	constructor(props: IBattleUIContainerProps) {
		super(props);
		this.state = Game.getInitialState(props.config.players, props.characters, props.parties, this.initiative);
	}

	public componentDidMount() {
		this.step();
	}

	public render() {
		return (
			<BattleUI
				game={this.state}
				onTileSelect={this.onTileSelect}
				onActionSelect={this.onActionSelect}
			/>
		);
	}

	private getCharacter(id?: string) {
		if (!id) {
			return;
		}
		return this.state.characters.find(char => id === char.data.id);
	}

	private getActor() {
		const actorId = this.state.actors[0];
		return this.getCharacter(actorId);
	}

	private step() {
		const phase = this.state.phase;

		if (GamePhase.IDLE !== phase && GamePhase.TICK !== phase) {
			return;
		}

		this.setState(
			{
				phase: GamePhase.TICK
			},
			() => setTimeout(() => {
				const tick = this.state.tick + 1;
				const actors: string[] = [];

				// update characters
				const characters = this.state.characters.map((char, i) => {
					const updated = Character.tick(char);

					// collect acting characters
					if (updated.currAttributes.CT >= config.characterCTLimit) {
						actors.push(updated.data.id);
					}
					return updated;
				});

				// generate order
				const order = Order.get(characters, this.initiative);

				// order actors
				let orderedActors: Array<[string, number]> = [];

				for (const a of actors) {
					orderedActors.push([a, order.indexOf(a)]);
				}
				orderedActors = orderedActors.sort((a, b) => a[1] - b[1]);

				this.setState(
					{
						characters,
						order,
						tick,
						actors: orderedActors.map(a => a[0])
					},
					() => actors.length ? this.startTurn() : this.step()
				);
			}, config.tickDelay)
		);
	}

	private startTurn(): void {
		const actor = this.getActor();

		if (!actor) {
			throw new Error('Cannot start turn of non-existent actor');
		}

		if (Character.isDead(actor)) {
			// remove dead character from actors
			return this.setState(
				state => ({
					actors: state.actors.filter(id => actor.data.id)
				}),
				() => this.state.actors.length ? this.startTurn() : this.step()
			);
		}
		const actorPos = actor.position;
		const obstacles = this.state.characters.map(char => char.position);
		const range = Math.min(actor.currAttributes.MOV, actor.currAttributes.AP);
		const movable = getMovableTiles(actorPos, obstacles, range);

		// update actor data
		this.setState(
			state => ({
				act: {
					phase: ActPhase.MOVE,
					initAP: actor.currAttributes.AP
				},
				move: {
					origin: actorPos,
					area: movable.movable,
					costMap: movable.cost
				},
				characters: state.characters.map(char => {
					if (Character.isEqual(actor, char)) {
						return Character.startTurn(actor);
					}
					return char;
				})
			}),
			() => this.act()
		);
	}

	private act() {
		const actor = this.getActor();
		let actions: IActions = [];

		if (!actor) {
			return;
		}

		if (PlayerType.ENEMY === actor.player) {
			// TODO - AI act
			actions = Character.getActions(actor);

		} else {
			// character actions
			actions = Character.getActions(actor);
		}

		this.setState(state => ({
			phase: GamePhase.ACT,
			act: {
				...state.act,
				phase: ActPhase.MOVE,
				actionMenu: actions
			}
		}));
	}

	private endTurn() {
		const actors = this.state.actors.slice(0);
		const actorId = actors[0];
		actors.shift();

		const characters = this.state.characters.map(char => {
			if (actorId === char.data.id) {
				char.currAttributes.CT %= config.characterCTLimit;
			}
			return char;
		});

		const order = Order.get(characters, this.initiative);

		this.setState(
			{
				phase: GamePhase.IDLE,
				actors,
				characters,
				order
			},
			() => actors.length ? this.startTurn() : this.step()
		);
	}

	private move() {
		const path = this.state.move.path;

		if (!path) {
			return this.endMove();
		}
		const movePath = path.slice(0); // path without actor position
		movePath.shift();

		if (!movePath.length) {
			return this.endMove();
		}
		const timing = Array(movePath.length).fill(config.moveAnimDuration);

		this.setState(
			state => ({
				act: {
					...state.act,
					phase: ActPhase.MOVE_ANIM,
					actionMenu: undefined
				}
			}),
			() => {
				// animate movement
				const moveAnim = new Animation(timing, step => {
					const actor = this.getActor();
					const initAP = this.state.act.initAP;
					const moveCostMap = this.state.move.costMap;

					if (!actor || !moveCostMap || ('undefined' === typeof initAP)) {
						throw new Error('Could not MOVE - actor does not exist');
					}
					const tile = movePath[step.number];
					const dir = Position.getDirection(actor.position, tile);

					this.setState(
						state => ({
							characters: state.characters.map(char => {
								if (Character.isEqual(actor, char)) {
									return {
										...actor,
										position: tile,
										direction: dir,
										currAttributes: {
											...char.currAttributes,
											AP: (initAP - moveCostMap[tile.id])
										}
									};
								}
								return char;
							})
						}),
						() => {
							// show menu
							if (step.isLast) {
								this.endMove();
							}
						}
					);
				});

				// start move animation
				moveAnim.start();
			}
		);
	}

	private endMove() {
		this.setState(
			state => ({
				act: {
					...state.act,
					phase: ActPhase.MOVE
				},
				move: {
					...state.move,
					path: undefined,
					target: undefined
				}
			}),
			() => this.act()
		);
	}

	private startSkill(action: IActionItem) {
		const skills = Skill.getByID(action.skills || []);
		const actor = this.getActor();

		if (!actor || !action.active || !skills.length) {
			throw new Error('Could not start skill - no actor');
		}
		const skillAreas = skills.map(skill => Skill.getTargetableArea(skill, actor.position));
		const targetable = ArrayUtils.getIntersection(skillAreas, pos => pos.id);
		const targets = Skill.getTargets(actor, skills[0], this.state.characters, targetable);

		// show skill targetable area
		this.setState(
			state => ({
				act: {
					...state.act,
					phase: ActPhase.ACTION,
					action,
					actionMenu: Character.getSkillActions(action.title, action.cost)
				},
				skill: {
					targets,
					targetArea: targetable
				}
			}),
			() => {
				// pre-select target of skill with SELF target
				if (1 === targets.length && SkillTarget.SELF === skills[0].target) {
					this.selectSkillTarget(targets[0]);
				}
			}
		);
	}

	private runSkill() {
		const { skill } = this.state;
		const actor = this.getActor();
		const action = this.state.act.action;
		const targetTile = skill.effectTarget;
		const targets = skill.effectTargets;

		if (!actor || !action || !targetTile) {
			throw new Error('Could not run skill - invalid ACT data');
		}
		if (!targets || !targets.length) {
			return this.endSkill();
		}
		const dir = Position.getDirection(actor.position, targetTile);

		this.setState(
			state => ({
				react: {
					...state.react,
					targets
				},
				characters: state.characters.map(char => {
					if (Character.isEqual(actor, char)) {
						return {
							...char,
							direction: dir // face character to skill target tile
						};
					}
					return char;
				})
			}),
			() => this.startReact()
		);
	}

	private endSkill() {
		this.setState(
			{
				skill: {}
			},
			() => this.startDirect()
		);
	}

	private startReact() {
		const targets = this.state.react.targets || [];

		if (!targets.length) {
			this.startAction();
			return;
		}
		const target = this.getCharacter(targets[0]);

		if (!target) {
			// goto reaction of next target character
			return this.endReact();
		}
		const actions = Character.getReactiveActions(target);

		// show target character reaction menu
		this.setState(state => ({
			act: {
				...state.act,
				phase: ActPhase.REACTION,
				actionMenu: actions
			}
		}));
	}

	private react(action: IActionItem) {
		const targets = this.state.react.targets || [];

		if (!targets.length) {
			throw new Error('Could not react - no reacting character');
		}
		const targetId = targets[0];
		const target = this.getCharacter(targetId);

		if (!target) {
			throw new Error('Could not react - invalid reacting character');
		}
		if (!action.skills || !action.skills.length) {
			throw new Error('Could not react - no action skill');
		}
		const skillId = action.skills[0];

		switch (skillId) {
			case ArchetypeSkillID.EVADE:
				const obstacles = this.state.characters.map(char => char.position);
				const evasionArea = Position.getSideTiles(target.position, obstacles);
				const actions = Character.getEvasionActions();

				// start evasion
				return this.setState(
					state => ({
						act: {
							...state.act,
							phase: ActPhase.EVASION,
							actionMenu: actions
						},
						react: {
							...state.react,
							evasionArea
						}
					})
				);

			case WeaponSkillID.SHIELD_SMALL_BLOCK:
				// apply shield block small
				return this.setState(
					state => ({
						characters: state.characters.map(char => {
							if (targetId === char.data.id) {
								return Character.applyStatus(char, 'BLOCK_SMALL');
							}
							return char;
						})
					}),
					() => this.endReact()
				);

			case WeaponSkillID.SHIELD_LARGE_BLOCK:
				// apply shield block large
				return this.setState(
					state => ({
						characters: state.characters.map(char => {
							if (targetId === char.data.id) {
								return Character.applyStatus(char, 'BLOCK_LARGE');
							}
							return char;
						})
					}),
					() => this.endReact()
				);

			default:
				throw new Error('Invalid reaction skill');
		}
	}

	private endReact() {
		this.setState(
			state => ({
				react: {
					...state.react,
					targets: state.react.targets ? state.react.targets.slice(1) : undefined
				}
			}),
			() => this.startReact()
		);
	}

	private startAction() {
		this.setState(state => ({
				act: {
					...state.act,
					actionMenu: undefined,
					phase: ActPhase.ACTION_ANIM
				},
				react: {}
			}),
			() => {
				const skillEffectArea = this.state.skill.effectArea;
				const targetIds = this.state.skill.effectTargets || [];
				const targets = targetIds.map(id => this.getCharacter(id));
				const action = this.state.act.action;

				if (!targets.length || !action || !action.skills || !action.skills.length) {
					return this.endSkill();
				}
				const timing = Array(targets.length).fill(config.skillAnimDuration);

				// animate skill action
				const skillAnim = new Animation(timing, step => {
					const actor = this.getActor();
					let target = targets[step.number];

					if (!actor || !target) {
						throw new Error('Could not run skill action');
					}

					if (!Character.isDead(target)) {
						if (Position.isContained(target.position, skillEffectArea)) {
							if (target.status.find(status => 'BLOCK_LARGE' === status.id)) {
								// target blocked attack with shield
								target = Character.removeStatus(target, 'BLOCK_LARGE');
								this.showSkillInfo('Blocked', target.position);

							} else {
								// caclulate character changes
								const targetPos = target.position;
								let info: string[] = [];

								for (const skill of action.skills) {
									const skillData = Skill.getByID([skill])[0];
									let phyDmg = 0;
									let elmDmg = 0;

									// physical damage
									phyDmg = Damage.getPhysical(actor, target, skill);
									info.push(NumberUtils.format(phyDmg));

									// elemental damage
									if (skillData.elementalDamage) {
										elmDmg = Damage.getElemental(actor, target, skill);
										info.push(NumberUtils.format(elmDmg));
									}

									// status effects
									const effects = Damage.getStatusEffects(actor, target, skill);
									const statuses = effects.map(id => StatusEffects.get(id)());

									// apply skill damage / statuses to target
									target = Character.applySkill(target, phyDmg + elmDmg, effects);

									if (Character.isDead(target)) {
										info.push('Dead');
										break;

									} else if (skillData.status) {
										info = [...info, ...statuses.map(status => status.title)];
									}

									// show small shield block info
									if (-1 !== effects.indexOf('BLOCK_SMALL')) {
										target = Character.removeStatus(target, 'BLOCK_SMALL');
										info.unshift(`Blocked (${config.smallShieldBlock})`);
									}
								}
								let infoTiming = Array(info.length).fill(0);
								infoTiming = infoTiming.map(i => NumberUtils.randomBetween(250, 350));

								const infoAnim = new Animation(infoTiming, infoStep => {
									this.showSkillInfo(info[infoStep.number], targetPos);
								});

								infoAnim.start();
							}

						} else {
							// target evaded skill action
							this.showSkillInfo('Evaded', target.position);
						}
					}

					// apply skill to a target
					this.setState(
						state => ({
							characters: state.characters.map(char => {
								if (!target) {
									throw new Error('Invalid target during skill animation');
								}
								if (Character.isEqual(target, char)) {
									return target;
								}
								return char;
							})
						}),
						() => {
							// skill end
							if (step.isLast) {
								// reduce actor AP
								this.setState(
									state => ({
										characters: state.characters.map(char => {
											if (Character.isEqual(actor, char)) {
												return Character.reduceAP(char, action.cost);
											}
											return char;
										})
									}),
									() => this.endSkill()
								);
							}
						}
					);
				});

				// start animation
				skillAnim.start();
			}
		);
	}

	private startDirect() {
		const actor = this.getActor();

		if (!actor) {
			return;
		}
		const directions = Position.getSideTiles(actor.position);

		if (!directions.length) {
			return this.endTurn();
		}

		// show available directions
		this.setState(
			state => ({
				act: {
					...state.act,
					phase: ActPhase.DIRECT,
					action: directAction(),
					actionMenu: undefined
				},
				direct: {
					area: directions,
					target: Position.getByDirection(actor.position, actor.direction),
				}
			})
		);
	}

	private confirm(action?: IActionItem) {
		if (!action) {
			throw new Error('Confirming non-existent action');
		}
		switch (action.id) {
			case ActionID.ATTACK:
			case ActionID.DOUBLE_ATTACK:
			case ActionID.WEAPON:
			case ActionID.MAGIC:
				return this.runSkill();

			default:
				throw new Error('Action is not comfirmable: ' + action.id);
		}
	}

	private selectMoveTarget(position: IPosition) {
		const characters = this.state.characters;
		const moveArea = this.state.move.area;
		const actor = this.getActor();

		if (!actor || !Position.isContained(position, moveArea)) {
			return;
		}
		const obstacles = characters.map(char => char.position);

		// add non-moveArea positions in obstacles
		for (let x = 0; x < config.gridSize; x++) {
			for (let y = 0; y < config.gridSize; y++) {
				const pos = Position.create(x, y);

				if (Position.isContained(pos, moveArea) || Position.isContained(pos, obstacles)) {
					continue;
				}
				obstacles.push(pos);
			}
		}
		const path = getShortestPath(actor.position, position, obstacles);

		this.setState(
			state => ({
				move: {
					...state.move,
					target: position,
					path
				}
			}),
			() => path.length ? this.move() : this.endMove()
		);
	}

	private selectSkillTarget(position: IPosition) {
		const { act, skill, characters } = this.state;
		const actor = this.getActor();
		const action = act.action;

		if (!actor || !action || !Position.isContained(position, skill.targets)) {
			return;
		}

		// confirm target on double selection
		const prevTarget = skill.effectTarget;

		if (prevTarget && Position.isEqual(prevTarget, position)) {
			return this.confirm(action);
		}

		// get skill effect area
		const skills = Skill.getByID(action.skills || []);

		if (!skills) {
			return;
		}
		const effectAreas = skills.map(s => Skill.getEffectArea(s, actor.position, position));
		const effectArea = ArrayUtils.getIntersection(effectAreas, pos => pos.id);
		const effectTargets = Skill.getEffectTargets(actor, skills[0], effectArea, characters);

		this.setState(state => ({
			act: {
				...state.act,
				actionMenu: Character.getSkillActions(action.title, action.cost, skill.targets)
			},
			skill: {
				effectArea,
				effectTargets,
				effectTarget: position,
			}
		}));
	}

	private selectDirectTarget(position: IPosition) {
		const direct = this.state.direct;
		const actor = this.getActor();

		if (!actor || !Position.isContained(position, direct.area)) {
			return;
		}
		const direction = Position.getDirection(actor.position, position);

		this.setState(
			state => ({
				direct: {},
				characters: state.characters.map(char => {
					if (Character.isEqual(actor, char)) {
						return {
							...char,
							direction
						};
					}
					return char;
				})
			}),
			() => this.endTurn()
		);
	}

	private selectEvasionTarget(position: IPosition) {
		const action = this.state.act.action;
		const targets = this.state.react.targets || [];
		const evasible = this.state.react.evasionArea;
		const targetId = targets[0];

		if (!Position.isContained(position, evasible)) {
			return;
		}
		if (!action || !action.skills || !action.skills.length || !targetId) {
			throw new Error('Could not evade');
		}
		const skills = Skill.getByID(action.skills);
		const cost = skills[0].cost;

		this.setState(
			state => ({
				characters: state.characters.map(char => {
					if (targetId === char.data.id) {
						return {
							...char,
							position,
							currAttributes: {
								...char.currAttributes,
								AP: char.currAttributes.AP - cost
							}
						};
					}
					return char;
				})
			}),
			() => this.endReact()
		);
	}

	private onTileSelect = (position: IPosition) => {
		const phase = this.state.act.phase;

		switch (phase) {
			case ActPhase.MOVE:
				// go to given position
				return this.selectMoveTarget(position);

			case ActPhase.ACTION:
				// select skill target
				return this.selectSkillTarget(position);

			case ActPhase.DIRECT:
				// select actor direction
				return this.selectDirectTarget(position);

			case ActPhase.EVASION:
				// select evesion tartget
				return this.selectEvasionTarget(position);

			case ActPhase.REACTION:
			case ActPhase.MOVE_ANIM:
			case ActPhase.ACTION_ANIM:
				// do nothing
				return;

			default:
				throw new Error('Unsupported act phase: ' + phase);
		}
	}

	private onActionSelect = (action: IActionItem) => {
		const phase = this.state.act.phase;

		switch (action.id) {
			case ActionID.ATTACK:
			case ActionID.DOUBLE_ATTACK:
			case ActionID.WEAPON:
			case ActionID.MAGIC:
				return this.startSkill(action);

			case ActionID.PASS:
				// end character turn
				return this.startDirect();

			case ActionID.REACTION:
				// apply reaction skill
				return this.react(action);

			case ActionID.DONT_REACT:
				// goto next reacting character
				return this.endReact();

			case ActionID.CONFIRM:
				// handle confirm action
				return this.confirm(this.state.act.action);

			case ActionID.BACK:
				switch (phase) {
					case ActPhase.EVASION:
						// cancel evasion reaction
						return this.startReact();

					case ActPhase.ACTION:
						// cancel current action > show menu
						return this.act();

					default:
						throw new Error('Cant go back during phase: ' + phase);
				}

			default:
				throw new Error('Unsupported action ID: ' + action.id);
		}
	}

	private showSkillInfo(text: string, position: IPosition, duration = 3000) {
		const infoId = performance.now();

		// set skill info item
		this.setState(
			state => ({
				skillInfo: [
					...state.skillInfo,
					{ id: infoId, text, position }
				]
			}),
			() => {
				// end skill info item
				setTimeout(() => {
					this.setState(state => ({
						skillInfo: state.skillInfo.filter(item => item.id !== infoId)
					}));
				}, duration);
			}
		);
	}
}

export default BattleUIContainer;
