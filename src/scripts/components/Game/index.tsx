import React from 'react';

import { IParty, Party } from 'models/party';
import { Order, IOrder } from 'models/order';
import { Position, IPosition } from 'models/position';
import { ICharacterData } from 'models/character-data';
import { Player, PlayerType, IPlayer } from 'models/player';
import { ICharacter, Character, ICharacterActions, CharacterActionID, ICharacterActionItem } from 'models/character';

import GameUI from 'components/Game/template';

export const gridSize = 12;
export const blockSize = 64;
export const allyPlayerName = 'Player';
export const enemyPlayerName = 'Computer';

const tickDelay = 50;

export enum GamePhase {
	IDLE = 'IDLE',
	TICK = 'TICK',
	ACT = 'ACT',
	REACT = 'REACT'
}

export type IOnActionSelect = (action: ICharacterActionItem) => void;
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
	characters: ICharacter[];
	ally: IPlayer;
	enemy: IPlayer;
	order: IOrder;
	tick: number;
	actors: string[]; // characters ID
	selected?: IPosition;
	characterActions?: ICharacterActions;
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
			order
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
		let actions: ICharacterActions = [];

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

		this.setState({
			phase: GamePhase.ACT,
			characterActions: actions
		});
	}

	private endAct() {
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
				actors,
				characters,
				order
			},
			() => actors.length ? this.act() : this.tick()
		);
	}

	private onGridSelect(position: IPosition) {
		this.setState({
			...this.state,
			selected: position
		});
	}

	private onCharacterSelect(character: ICharacter) {
		this.setState({
			...this.state,
			selected: character.position
		});
	}

	private onActionSelect(action: ICharacterActionItem) {
		const actor = this.getActor();

		if (!actor) {
			return;
		}
		console.log(actor.data.name, action.id, action.skills);

		switch (action.id) {
			case CharacterActionID.MOVE:
			case CharacterActionID.ATTACK:
			case CharacterActionID.WEAPON:
			case CharacterActionID.JOB:
			case CharacterActionID.PASS:
				return this.endAct();
		}
	}
}

export default GameUIContainer;
