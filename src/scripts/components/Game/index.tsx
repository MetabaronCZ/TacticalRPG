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
	actor: string; // character ID
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
			actor: '',
			ally,
			enemy,
			characters,
			order
		};
	}

	private getActor() {
		return this.state.characters.find(char => this.state.actor === char.data.id);
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
				let characterOnMove: string = '';

				// update characters
				let characters = this.state.characters.map((char, i) => {
					const updated = Character.tick(char);

					if (updated.currAttributes.CP >= Character.cpLimit) {
						characterOnMove = char.data.id;
					}
					return updated;
				});

				// generate order
				const order = Order.get(characters, this.initiative);

				// fix excess CP
				if (characterOnMove) {
					characters = characters.map(char => {
						char.currAttributes.CP %= Character.cpLimit;
						return char;
					});
				}

				this.setState(
					{
						characters,
						order,
						tick,
						actor: characterOnMove
					},
					() => !characterOnMove ? this.tick() : this.act()
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

		console.log('Action', actor.data.name, action);

		if (CharacterActionID.PASS === action.id) {
			// pass character ACT phase
			return this.setState({ phase: GamePhase.TICK }, () => this.tick());
		}
	}
}

export default GameUIContainer;
