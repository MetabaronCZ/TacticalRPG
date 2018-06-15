import React from 'react';

import Animation from 'core/animation';
import * as ArrayUtils from 'core/array';

import { gridSize, moveAnimDuration } from 'data/game-config';
import GameUI from 'components/Game/template';

import { Order } from 'modules/order';
import { IParty } from 'modules/party';
import { PlayerType } from 'modules/player';
import { Skill, ISkill } from 'modules/skill';
import { SkillTarget } from 'modules/skill/attributes';
import { Position, IPosition } from 'modules/position';
import { ICharacterData } from 'modules/character-data';
import { ICharacter, Character } from 'modules/character';
import { getShortestPath, getMovableTiles } from 'modules/pathfinding';
import { IGameState, GamePhase, ActPhase, getInitialState } from 'modules/game';
import { IActions, ActionID, IActionItem, directAction } from 'modules/character-action';

interface IGameUIContainerProps {
	party: IParty;
	characters: ICharacterData[];
	onSummary: () => any;
	onExit: () => any;
}

class GameUIContainer extends React.Component<IGameUIContainerProps, IGameState> {
	private initiative: PlayerType;

	constructor(props: IGameUIContainerProps) {
		super(props);

		this.onTileSelect = this.onTileSelect.bind(this);
		this.onActionSelect = this.onActionSelect.bind(this);

		this.initiative = (Math.random() < 0.5 ? PlayerType.ALLY : PlayerType.ENEMY);
		this.state = getInitialState(props.party.characters, props.characters, this.initiative);
	}

	public componentDidMount() {
		this.tick();
	}

	public render() {
		return (
			<GameUI
				game={this.state}
				onTileSelect={this.onTileSelect}
				onActionSelect={this.onActionSelect}
			/>
		);
	}

	private getActor() {
		return this.state.characters.find(char => this.state.actors[0] === char.data.id);
	}

	private tick() {
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
					if (updated.currAttributes.CT >= Character.ctLimit) {
						actors.push(updated.data.id);
					}
					return updated;
				});

				// generate order
				const order = Order.get(characters, this.initiative);

				// order actors
				let orderedActors: any[] = [];

				for (const a of actors) {
					orderedActors.push([a, order.indexOf(a)]);
				}
				orderedActors = orderedActors.sort((a, b) => a[1] - b[1]);
				orderedActors = orderedActors.map(a => a[0]);

				this.setState(
					{
						characters,
						order,
						tick,
						actors: orderedActors
					},
					() => actors.length ? this.startTurn() : this.tick()
				);
			}, 0)
		);
	}

	private startTurn() {
		const actor = this.getActor();

		if (!actor) {
			return;
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
				char.currAttributes.CT %= Character.ctLimit;
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
			() => actors.length ? this.startTurn() : this.tick()
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
		const timing = Array(movePath.length).fill(moveAnimDuration);

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
					const tile = movePath[step.number - 1];
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

	private startSkill(action: IActionItem, skills: ISkill[]) {
		const actor = this.getActor();

		if (!actor || !action.active || !skills.length) {
			return;
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
		const actor = this.getActor();
		const { skill, characters } = this.state;
		const action = this.state.act.action;
		const targetTile = skill.effectTarget;
		const targetTiles = skill.effectTargets;

		if (!actor || !action || !targetTile) {
			throw new Error('Could not run skill - invalid ACT data');
		}
		if (!targetTiles || !targetTiles.length) {
			this.endSkill();
		}
		const dir = Position.getDirection(actor.position, targetTile);
		const skills = Skill.getByID(action.skills || []);
		const targets: ICharacter[] = [];

		// collect skill target characters
		for (const char of characters) {
			if (Position.isContained(char.position, targetTiles)) {
				targets.push(char);
			}
		}

		this.setState(
			state => ({
				act: {
					...state.act,
					phase: ActPhase.ACTION_ANIM,
					actionMenu: undefined
				},
				characters: state.characters.map(char => {
					if (Character.isEqual(actor, char)) {
						// face character to skill target tile
						return {
							...char,
							direction: dir
						};
					} else {
						return char;
					}
				})
			}),
			() => {
				// TODO
				console.log('actor:', actor.data.name);
				console.log('skill:', skills.map(s => s.title));
				console.log('targets:', targets.map(char => char.data.name));

				this.endSkill();
			}
		);
	}

	private endSkill() {
		this.setState(
			state => ({ skill: {} }),
			() => this.startDirect()
		);
	}

	private startDirect() {
		const actor = this.getActor();

		if (!actor) {
			return;
		}
		const characters = this.state.characters.map(char => char.position);
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
					action: directAction,
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
			case ActionID.JOB:
				return this.runSkill();

			case ActionID.DIRECT:
			default:
				throw new Error(`Action is not comfirmable: ${action.id}`);
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
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
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
					path,
					target: position
				}
			}),
			() => path.length ? this.move() : this.endMove()
		);
	}

	private selectSkillTarget(position: IPosition) {
		const { act, skill, characters } = this.state;
		const action = act.action;
		const actor = this.getActor();

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
		const { direct } = this.state;
		const actor = this.getActor();

		if (!actor || !Position.isContained(position, direct.area)) {
			return;
		}
		this.setState(
			state => ({
				direct: {},
				characters: state.characters.map(char => {
					if (Character.isEqual(actor, char)) {
						return {
							...char,
							direction: Position.getDirection(actor.position, position)
						};
					}
					return char;
				})
			}),
			() => this.endTurn()
		);
	}

	private onTileSelect(position: IPosition) {
		switch (this.state.act.phase) {
			case ActPhase.MOVE:
				// go to given position
				return this.selectMoveTarget(position);

			case ActPhase.ACTION:
				// select skill target
				return this.selectSkillTarget(position);

			case ActPhase.DIRECT:
				// select actor direction
				return this.selectDirectTarget(position);

			case ActPhase.MOVE_ANIM:
			case ActPhase.ACTION_ANIM:
				// do nothing during animation
				return;

			default:
				throw new Error('Unsupported act phase');
		}
	}

	private onActionSelect(action: IActionItem) {
		switch (action.id) {
			case ActionID.ATTACK:
			case ActionID.DOUBLE_ATTACK:
			case ActionID.WEAPON:
			case ActionID.JOB:
				return this.startSkill(action, Skill.getByID(action.skills || []));

			case ActionID.PASS:
				// end character turn
				return this.startDirect();

			case ActionID.CONFIRM:
				// handle confirm action
				return this.confirm(this.state.act.action);

			case ActionID.BACK:
				// cancel current action > show menu
				return this.act();

			default:
				throw new Error('Unsupported action ID');
		}
	}
}

export default GameUIContainer;
