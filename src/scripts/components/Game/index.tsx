import React from 'react';
import { connect, Dispatch } from 'react-redux';

import { IState, IAction } from 'store';
import orderAction from 'actions/game/order';
import playerAction from 'actions/game/players';
import characterAction from 'actions/game/characters';

import { IGame } from 'models/game';
import { PlayerType } from 'models/player';
import { Position } from 'models/position';
import { ICharacter } from 'models/character';
import { IParty, Party } from 'models/party';
import { ICharacterData } from 'models/character-data';

import GameUI from 'components/Game/template';

const allyPlayerName = 'Player';
const enemyPlayerName = 'Computer';

export const gridSize = 12;
export const blockSize = 64;

export type IOnGridSelect = (pos: Position) => void;
export type IOnCharacterSelect = (char: ICharacter) => void;

export interface IGameUIProps {
	store: IGame;
	party: IParty;
	characters: ICharacterData[];
	startGame: (charIds: string[], characters: ICharacterData[]) => void;
	onCharacterSelect: () => any;
	onGridSelect: () => any;
	onSummary: () => any;
	onExit: () => any;
}

const mapStateToProps = (state: IState) => ({
	store: state.game
});

const mapDispatchToProps = (dispatch: Dispatch<IAction>) => ({
	startGame: (charIds: string[], characters: ICharacterData[]) => {
		const party = charIds
			.filter((id) => !!id)
			.map((id) => Party.getCharacterById(id, characters));

		const ally = party;
		const enemy = Party.getRandomCharacters(party.length);
		const initiative = (Math.random() < 0.5 ? PlayerType.ALLY : PlayerType.ENEMY);

		// inititalize players
		dispatch(playerAction.add(allyPlayerName, PlayerType.ALLY));
		dispatch(playerAction.add(enemyPlayerName, PlayerType.ENEMY));

		// initialize characters
		party.forEach((ch, i) => {
			dispatch(
				characterAction.add(ally[i], PlayerType.ALLY, new Position(i + 2, gridSize - 1))
			);
			dispatch(
				characterAction.add(enemy[i], PlayerType.ENEMY, new Position(i + 2, 0))
			);
		});

		// create character order
		dispatch(orderAction.update(initiative));
	},
	onCharacterSelect: (char: ICharacter) => {
		// TODO: show character info or select character for action
		console.log('CHARACTER selected', char);
	},
	onGridSelect: (pos: Position) => {
		// TODO: show block info or character goto block
		console.log('GRID selected', pos);
	}
});

class GameUIContainer extends React.Component<IGameUIProps, {}> {
	public componentWillMount() {
		const { party, characters, startGame } = this.props;

		// init game state
		startGame(party.characters, characters);
	}

	public render() {
		return (
			<GameUI {...this.props} />
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(GameUIContainer);
