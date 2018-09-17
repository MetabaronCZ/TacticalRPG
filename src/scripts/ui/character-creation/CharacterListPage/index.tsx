import React from 'react';
import { Dispatch } from 'redux';
import { Action } from 'redux-actions';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { IStore } from 'store';
import { gotoFn } from 'utils/nav';
import * as Selector from 'selectors';
import Actions from 'actions/characters';
import { CharacterData } from 'engine/character-data';

import CharacterListPage from 'ui/character-creation/CharacterListPage/template';
import { IOnDelete, IOnMoveUp, IOnMoveDown } from 'ui/character-creation/CharacterList';

interface IStateToProps {
	readonly characters: CharacterData[];
}

interface ICharacterListPageContainerProps extends RouteComponentProps<any> {
	readonly onMoveDown: IOnMoveDown;
	readonly onMoveUp: IOnMoveUp;
	readonly onDelete: IOnDelete;
}

const mapStateToProps = (state: IStore): IStateToProps => ({
	characters: Selector.getCharacters(state)
});

const mapDispatchToProps = (dispatch: Dispatch<Action<CharacterData>>) => ({
	onMoveDown: (char: CharacterData) => () => {
		dispatch(Actions.moveDownList(char));
	},
	onMoveUp: (char: CharacterData) => () => {
		dispatch(Actions.moveUpList(char));
	},
	onDelete: (char: CharacterData, name: string) => () => {
		if (confirm(`Do you realy want to delete "${name}"?`)) {
			dispatch(Actions.removeCharacter(char));
		}
	}
});

const CharacterListPageContainer: React.SFC<ICharacterListPageContainerProps & IStateToProps> = props => {
	const { characters, history, onMoveDown, onMoveUp, onDelete } = props;

	return (
		<CharacterListPage
			characters={characters}
			onBack={gotoFn(history, '/')}
			onCreate={gotoFn(history, '/character-create')}
			onMoveDown={onMoveDown}
			onMoveUp={onMoveUp}
			onDelete={onDelete}
		/>
	);
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(CharacterListPageContainer)
);
