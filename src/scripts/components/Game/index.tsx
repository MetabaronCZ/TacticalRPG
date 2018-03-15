import React from 'react';
import { connect, Dispatch } from 'react-redux';

import { IState, IAction } from 'store';
import { default as Action } from 'actions/game';

import { IParty } from 'models/party';
import { IGame, Game } from 'models/game';
import { Position } from 'models/position';
import { ICharacter } from 'models/character';
import { ICharacterData } from 'models/character-data';

import GameUI from 'components/Game/template';

export type IOnGridSelect = (pos: Position) => void;
export type IOnCharacterSelect = (char: ICharacter) => void;

export interface IGameUIProps {
	game: IGame;
	party: IParty;
	characters: ICharacterData[];
	startGame: (charIds: string[], characters: ICharacterData[]) => void;
	onCharacterSelect: () => any;
	onGridSelect: () => any;
	onSummary: () => any;
	onExit: () => any;
}

const mapStateToProps = (state: IState) => ({
	game: state.game
});

const mapDispatchToProps = (dispatch: Dispatch<IAction>) => ({
	startGame: (charIds: string[], characters: ICharacterData[]) => {
		const game = Game.create(charIds, characters);
		dispatch(Action.gameStart(game.ally, game.enemy, game.characters, game.initiative));
		dispatch(Action.orderUpdate());
	},
	onCharacterSelect: (char: ICharacter) => {
		dispatch(Action.characterSelect(char));
	},
	onGridSelect: (pos: Position) => {
		dispatch(Action.gridSelect(pos));
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
