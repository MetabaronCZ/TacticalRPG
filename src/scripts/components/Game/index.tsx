import React from 'react';

import Animation from 'models/animation';
import { IParty, Party } from 'models/party';
import { Order, IOrder } from 'models/order';
import { Skill, ISkill } from 'models/skill';
import { JobSkillID } from 'models/skill/job/id';
import { Position, IPosition } from 'models/position';
import { WeaponSkillID } from 'models/skill/weapon/id';
import { ICharacterData } from 'models/character-data';
import { JobSkills, JobSkillList } from 'models/skill/job';
import { Player, PlayerType, IPlayer } from 'models/player';
import { WeaponSkills, WeaponSkillList } from 'models/skill/weapon';
import { getShortestPath, getMovableTiles } from 'models/pathfinding';
import { ICharacter, Character, IActions, ActionID, IActionItem } from 'models/character';

import * as ArrayUtils from 'utils/array';
import GameUI from 'components/Game/template';

const moveAnimDuration = 150;

export const gridSize = 12;
export const blockSize = 64;
export const allyPlayerName = 'Player';
export const enemyPlayerName = 'Computer';

export enum GamePhase {
	IDLE = 'IDLE',
	TICK = 'TICK',
	ACT = 'ACT',
	REACT = 'REACT'
}

export type IOnActionSelect = (action: IActionItem) => void;
export type IOnTileSelect = (pos: IPosition) => void;

interface IGameUIContainerProps {
	party: IParty;
	characters: ICharacterData[];
	onSummary: () => any;
	onExit: () => any;
}

export interface IGameState {
	phase: GamePhase;
	act: {
		action?: IActionItem;
		actionMenu?: IActions;
		hasMoved: boolean;
		movePath?: IPosition[];
		moveArea?: IPosition[]; // movable tiles
		moveTarget?: IPosition; // move target tile
		skillTargetArea?: IPosition[]; // skill range tiles
		skillTargets?: IPosition[]; // skill targetable tiles
		skillEffectArea?: IPosition[]; // skill effect area tiles
		skillEffectTargets?: IPosition[]; // skill effect targets
	};
	characters: ICharacter[];
	ally: IPlayer;
	enemy: IPlayer;
	order: IOrder;
	tick: number;
	actors: string[]; // character ID array
}

class GameUIContainer extends React.Component<IGameUIContainerProps, IGameState> {
	private initiative: PlayerType;

	constructor(props: IGameUIContainerProps) {
		super(props);

		this.onTileSelect = this.onTileSelect.bind(this);
		this.onActionSelect = this.onActionSelect.bind(this);

		this.initiative = (Math.random() < 0.5 ? PlayerType.ALLY : PlayerType.ENEMY);
		this.initGameState(props.party.characters, props.characters);
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

	public componentDidMount() {
		this.tick();
	}

	private initGameState(charIds: string[], chars: ICharacterData[]) {
		const party = charIds
			.filter(id => !!id)
			.map(id => Party.getCharacterById(id, chars));

		const ally = Player.create(allyPlayerName, PlayerType.ALLY);
		const enemy = Player.create(enemyPlayerName, PlayerType.ENEMY);

		const allies = party.map((char, i) => {
			return Character.create(char, Position.create(i + 2, gridSize - 1), PlayerType.ALLY);
		});

		const enemies = Party.getRandomCharacters(party.length)
			.map((char, i) => {
				return Character.create(char, Position.create(i + 2, 0), PlayerType.ENEMY);
			});

		const characters = allies.concat(enemies);
		const order = Order.get(characters, this.initiative);

		this.state = {
			phase: GamePhase.IDLE,
			tick: 0,
			actors: [],
			ally,
			enemy,
			characters,
			order,
			act: {
				hasMoved: false
			}
		};
	}

	private getActor() {
		return this.state.characters.find(char => this.state.actors[0] === char.data.id);
	}

	private getSkills(action = this.state.act.action): ISkill[] {
		if (!action || !action.skills || !action.skills.length) {
			return [];
		}
		let skillIds = action.skills;

		if (WeaponSkills.has(skillIds[0] as WeaponSkillID)) {
			skillIds = skillIds as WeaponSkillID[];
			return skillIds.map(id => WeaponSkills.get(id));
		} else {
			skillIds = skillIds as JobSkillID[];
			return skillIds.map(id => JobSkills.get(id));
		}
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
					if (updated.currAttributes.CP >= Character.cpLimit) {
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

		// update actor data
		this.setState(
			{
				characters: this.state.characters.map(char => {
					if (actor.data.id === char.data.id) {
						return Character.startTurn(actor);
					}
					return char;
				})
			},
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
			actions = Character.getActions(actor, this.state.act.hasMoved);

		} else {
			// character actions
			actions = Character.getActions(actor, this.state.act.hasMoved);
		}

		this.setState({
			phase: GamePhase.ACT,
			act: {
				...this.state.act,
				action: undefined,
				actionMenu: actions,
				movePath: undefined,
				moveArea: undefined,
				moveTarget: undefined,
				skillTargetArea: undefined,
				skillTargets: undefined,
				skillEffectArea: undefined,
				skillEffectTargets: undefined
			}
		});
	}

	private endTurn() {
		const actors = this.state.actors.slice(0);
		const actor = actors[0];
		actors.shift();

		const characters = this.state.characters.map(char => {
			if (actor === char.data.id) {
				char.currAttributes.CP %= Character.cpLimit;
			}
			return char;
		});

		const order = Order.get(characters, this.initiative);

		return this.setState(
			{
				phase: GamePhase.IDLE,
				act: {
					action: undefined,
					hasMoved: false,
					moveTarget: undefined,
					movePath: undefined,
					moveArea: undefined
				},
				actors,
				characters,
				order
			},
			() => actors.length ? this.startTurn() : this.tick()
		);
	}

	private startMove(action: IActionItem) {
		const actor = this.getActor();

		if (!actor) {
			return;
		}
		const obstacles = this.state.characters.map(char => char.position);
		const range = Math.min(actor.currAttributes.MOV, actor.currAttributes.AP);
		const movable = getMovableTiles(actor.position, obstacles, range, gridSize);

		// show movable area
		this.setState({
			act: {
				...this.state.act,
				action,
				actionMenu: Character.getMoveActions(),
				moveArea: movable
			}
		});
	}

	private move() {
		const actor = this.getActor();
		const state = this.state;
		const path = state.act.movePath;

		if (!actor) {
			throw new Error('Could not MOVE - actor does not exist');
		}

		if (!path) {
			return this.endMove();
		}
		const timing = Array(path.length).fill(moveAnimDuration);

		this.setState(
			{
				act: {
					...state.act,
					actionMenu: undefined
				}
			},
			() => {
				// animate movement
				const moveAnim = new Animation(timing, step => {
					const tile = path[step.number - 1];

					// change character position
					this.setState(
						{
							characters: this.state.characters.map(char => {
								if (char.data.id === actor.data.id) {
									return {
										...actor,
										position: tile,
										currAttributes: {
											...char.currAttributes,
											AP: (char.currAttributes.AP - tile.cost)
										}
									};
								}
								return char;
							})
						},
						() => {
							// return to main menu
							if (step.isLast) {
								this.endMove();
							}
						}
					);
				});

				moveAnim.start();
			}
		);
	}

	private endMove() {
		this.setState(
			{
				act: {
					...this.state.act,
					hasMoved: true,
					moveArea: undefined,
					movePath: undefined,
					moveTarget: undefined
				}
			},
			() => this.act()
		);
	}

	private startSkill(action: IActionItem, skills: ISkill[]) {
		const actor = this.getActor();

		if (!actor || !action.active || !skills.length) {
			return;
		}
		const skillAreas = skills.map(skill => Skill.getTargetableArea(skill, actor.position, gridSize));
		const targetable = ArrayUtils.getIntersection(skillAreas, pos => pos.id);
		const targets = Skill.getTargets(actor, skills[0], this.state.characters, targetable);

		// show skill targetable area
		this.setState({
			act: {
				...this.state.act,
				action,
				actionMenu: Character.getSkillActions(action.title, action.cost),
				skillTargets: targets,
				skillTargetArea: targetable
			}
		});
	}

	private runSkill() {
		const actor = this.getActor();
		const { act, characters } = this.state;
		const targetTiles = act.skillEffectTargets;

		if (!actor || !act.action) {
			throw new Error('Could not run skill - actor does not exist');
		}
		if (!targetTiles || !targetTiles.length) {
			this.endSkill();
		}
		const skills = this.getSkills();
		const targets: ICharacter[] = [];

		// collect skill target characters
		for (const char of characters) {
			if (Position.isContained(char.position, targetTiles)) {
				targets.push(char);
			}
		}

		this.setState(
			{
				act: {
					...act,
					actionMenu: undefined
				}
			},
			() => {
				// TODO
				console.log('actor:', actor.data.name);
				console.log('skill:', skills.map(skill => skill.title));
				console.log('targets:', targets.map(char => char.data.name));
				this.endSkill();
			}
		);
	}

	private endSkill() {
		this.setState(
			{
				act: {
					...this.state.act,
					skillTargetArea: undefined,
					skillTargets: undefined,
					skillEffectArea: undefined,
					skillEffectTargets: undefined
				}
			},
			() => this.endTurn()
		);
	}

	private confirm(action?: IActionItem) {
		if (!action) {
			throw new Error('Confirming non-existent action');
		}
		switch (action.id) {
			case ActionID.MOVE:
				return this.move();

			case ActionID.ATTACK:
			case ActionID.DOUBLE_ATTACK:
			case ActionID.WEAPON:
			case ActionID.JOB:
				return this.runSkill();

			default:
				throw new Error(`Action is not comfirmable: ${action.id}`);
		}
	}

	private selectMoveTarget(position: IPosition) {
		const { act: { moveArea }, characters } = this.state;
		const actor = this.getActor();

		if (!actor || !Position.isContained(position, moveArea)) {
			return;
		}
		const obstacles = characters.map(char => char.position);
		const path = getShortestPath(actor.position, position, obstacles, gridSize);

		this.setState({
			act: {
				...this.state.act,
				actionMenu: Character.getMoveActions(path),
				moveTarget: position,
				movePath: path
			}
		});
	}

	private selectSkillTarget(position: IPosition) {
		const { act: { action, skillTargets }, characters } = this.state;
		const actor = this.getActor();

		if (!actor || !action || !Position.isContained(position, skillTargets)) {
			return;
		}
		const skills = this.getSkills();

		if (!skills) {
			return;
		}
		const effectAreas = skills.map(skill => Skill.getEffectArea(skill, actor.position, position, gridSize));
		const effectArea = ArrayUtils.getIntersection(effectAreas, pos => pos.id);
		const targets = Skill.getEffectTargets(actor, skills[0], effectArea, characters);

		this.setState({
			act: {
				...this.state.act,
				actionMenu: Character.getSkillActions(action.title, action.cost, skillTargets),
				skillTargetArea: undefined,
				skillTargets: undefined,
				skillEffectArea: effectArea,
				skillEffectTargets: targets
			}
		});
	}

	private onTileSelect(position: IPosition) {
		const action = this.state.act.action;

		if (!action) {
			return;
		}
		switch (action.id) {
			case ActionID.MOVE:
				return this.selectMoveTarget(position);

			case ActionID.ATTACK:
			case ActionID.DOUBLE_ATTACK:
			case ActionID.WEAPON:
			case ActionID.JOB:
				return this.selectSkillTarget(position);

			default:
				throw new Error('Unsupported tile select action');
		}
	}

	private onActionSelect(action: IActionItem) {
		const actor = this.getActor();

		if (!actor) {
			return;
		}
		switch (action.id) {
			case ActionID.MOVE:
				// starts MOVE action
				return this.startMove(action);

			case ActionID.ATTACK:
			case ActionID.DOUBLE_ATTACK:
			case ActionID.WEAPON:
			case ActionID.JOB:
				return this.startSkill(action, this.getSkills(action));

			case ActionID.PASS:
				// ends character turn
				return this.endTurn();

			case ActionID.CONFIRM:
				// overall CONFIRM action handler
				return this.confirm(this.state.act.action);

			case ActionID.BACK:
				// cancelling current action brings back main character menu
				return this.act();

			default:
				throw new Error('Unsupported action ID');
		}
	}
}

export default GameUIContainer;
