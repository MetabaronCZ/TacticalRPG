import React from 'react';

import { Position } from 'models/position';
import { IParty, Party } from 'models/party';
import { Round, IRound } from 'models/round';
import { Order, IOrder } from 'models/order';
import { ICharacterData } from 'models/character-data';
import { ICharacter, Character } from 'models/character';
import { Player, PlayerType, IPlayer } from 'models/player';

import GameUI from 'components/Game/template';

export const gridSize = 12;
export const blockSize = 64;
export const allyPlayerName = 'Player';
export const enemyPlayerName = 'Computer';

export type IOnCharacterSelect = (char: ICharacter) => void;
export type IOnGridSelect = (pos: Position) => void;

interface IGameUIContainerProps {
	party: IParty;
	characters: ICharacterData[];
	onSummary: () => any;
	onExit: () => any;
}

export interface IGameState {
	characters: ICharacter[];
	ally?: IPlayer;
	enemy?: IPlayer;
	order: IOrder;
	round: IRound;
	selected?: Position;
	initiative?: PlayerType;
}

class GameUIContainer extends React.Component<IGameUIContainerProps, IGameState> {
	constructor(props: IGameUIContainerProps) {
		super(props);

		this.initGameState(props.party.characters, props.characters);

		this.onGridSelect = this.onGridSelect.bind(this);
		this.onCharacterSelect = this.onCharacterSelect.bind(this);
	}

	public render() {
		return (
			<GameUI
				order={this.state.order}
				characters={this.state.characters}
				selected={this.state.selected}
				onCharacterSelect={this.onCharacterSelect}
				onGridSelect={this.onGridSelect}
			/>
		);
	}

	private initGameState(charIds: string[], chars: ICharacterData[]) {
		const party = charIds
			.filter(id => !!id)
			.map(id => Party.getCharacterById(id, chars));

		const ally = Player.create(allyPlayerName, PlayerType.ALLY);
		const enemy = Player.create(enemyPlayerName, PlayerType.ENEMY);

		const allies = party.map((char, i) => {
			return Character.create(char, new Position(i + 2, gridSize - 1), PlayerType.ALLY);
		});

		const enemies = Party.getRandomCharacters(party.length)
			.map((char, i) => {
				return Character.create(char, new Position(i + 2, 0), PlayerType.ENEMY);
			});

		const round = Round.getDefault();
		const initiative = (Math.random() < 0.5 ? PlayerType.ALLY : PlayerType.ENEMY);
		const characters = allies.concat(enemies);
		const order = Order.get(characters, initiative);

		this.state = {
			ally,
			enemy,
			characters,
			initiative,
			round,
			order
		};
	}
	private onGridSelect(position: Position) {
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
}

export default GameUIContainer;
