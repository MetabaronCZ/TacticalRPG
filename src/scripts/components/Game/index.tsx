import React from 'react';

import Animation from 'models/animation';
import { IParty, Party } from 'models/party';
import { Order, IOrder } from 'models/order';
import { ICharacterData } from 'models/character-data';
import { Position, IPosition } from 'models/position';
import { Player, PlayerType, IPlayer } from 'models/player';
import { getShortestPath, getMovableTiles, IPath } from 'models/pathfinding';
import { ICharacter, Character, IActions, ActionID, IActionItem } from 'models/character';

import GameUI from 'components/Game/template';

const tickDelay = 20;
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
export type IOnCharacterSelect = (char: ICharacter) => void;
export type IOnGridSelect = (pos: IPosition) => void;

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
		selected?: IPosition;
		hasMoved: boolean;
		path?: IPath;
	};
	characters: ICharacter[];
	ally: IPlayer;
	enemy: IPlayer;
	order: IOrder;
	tick: number;
	actors: string[]; // character ID array
	actionMenu?: IActions;
	movable?: IPosition[]; // array of position actor can move to
}

class GameUIContainer extends React.Component<IGameUIContainerProps, IGameState> {
	private initiative: PlayerType;

	constructor(props: IGameUIContainerProps) {
		super(props);

		this.onGridSelect = this.onGridSelect.bind(this);
		this.onCharacterSelect = this.onCharacterSelect.bind(this);
		this.onActionSelect = this.onActionSelect.bind(this);

		this.initiative = (Math.random() < 0.5 ? PlayerType.ALLY : PlayerType.ENEMY);
		this.initGameState(props.party.characters, props.characters);
	}

	public render() {
		return (
			<GameUI
				game={this.state}
				onCharacterSelect={this.onCharacterSelect}
				onGridSelect={this.onGridSelect}
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
				action: undefined,
				hasMoved: false
			}
		};
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
					() => actors.length ? this.act() : this.tick()
				);
			}, tickDelay)
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
				selected: undefined,
				path: undefined
			},
			actionMenu: actions,
			movable: undefined
		});
	}

	private endAct() {
		console.log((() => { const a = this.getActor(); return a ? a.data.name : ''; })(), '> END ACT');

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
					selected: undefined,
					path: undefined
				},
				actors,
				characters,
				order,
				movable: undefined
			},
			() => actors.length ? this.act() : this.tick()
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

		this.setState({
			act: {
				...this.state.act,
				action,
			},
			movable,
			actionMenu: Character.getMoveActions()
		});
	}

	private move() {
		const actor = this.getActor();
		const path = this.state.act.path;

		if (!actor) {
			throw new Error('Could not MOVE - actor does not exist');
		}

		if (!path) {
			return this.endMove();
		}
		const timing = Array(path.length).fill(moveAnimDuration);
		console.log(actor.data.name, '> MOVE');

		this.setState(
			{
				actionMenu: undefined
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
					hasMoved: true
				},
				movable: undefined
			},
			() => this.act()
		);
	}

	private confirm(action?: IActionItem) {
		if (!action) {
			throw new Error('Confirming non-existent action');
		}
		switch (action.id) {
			case ActionID.MOVE:
				return this.move();

			default:
				return this.act();
		}
	}

	private selectMovePosition(position: IPosition) {
		const { movable, characters } = this.state;
		const actor = this.getActor();

		if (!actor || !Position.isContained(position, movable)) {
			return;
		}
		const obstacles = characters.map(char => char.position);
		const path: IPath = getShortestPath(actor.position, position, obstacles, gridSize);

		this.setState({
			act: {
				...this.state.act,
				selected: position,
				path
			},
			actionMenu: Character.getMoveActions(path)
		});
	}

	private onGridSelect(position: IPosition) {
		const action = this.state.act.action;

		if (!action) {
			return;
		}
		switch (action.id) {
			case ActionID.MOVE:
				return this.selectMovePosition(position);
		}
	}

	private onCharacterSelect(character: ICharacter) {
		const action = this.state.act.action;

		if (!action) {
			return;
		}
		switch (action.id) {
			case ActionID.MOVE:
				return this.selectMovePosition(character.position);
		}
	}

	private onActionSelect(action: IActionItem) {
		const actor = this.getActor();

		if (!actor) {
			return;
		}
		switch (action.id) {
			case ActionID.MOVE:
				return this.startMove(action);

			case ActionID.ATTACK:
			case ActionID.WEAPON:
			case ActionID.JOB:
				console.log(`${actor.data.name} > ${action.id} (${action.skills})`);
				return;

			case ActionID.PASS:
				return this.endAct();

			case ActionID.CONFIRM:
				return this.confirm(this.state.act.action);

			case ActionID.BACK:
				return this.act();
		}
	}
}

export default GameUIContainer;
