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
import { store } from 'index';

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
	onDelete: (char: CharacterData) => () => {
		if (confirm(`Do you realy want to delete "${char.getName()}"?`)) {
			const { parties } = store.getState();
			const included: string[] = [];

			for (const party of parties) {
				if (party.getCharacters().find((ch: CharacterData|null) => !!ch && ch.id === char.id)) {
					included.push(party.getName());
				}
			}

			if (included.length) {
				return alert(`Could not delete "${char.getName()}": character is included in party (${included.join(', ')})`);
			}
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
