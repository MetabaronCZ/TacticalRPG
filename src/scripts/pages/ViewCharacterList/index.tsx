import React from 'react';
import { Action } from 'redux-actions';
import { connect, Dispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { IStore } from 'store';
import { gotoFn } from 'utils/nav';
import * as Selector from 'selectors';
import Actions from 'actions/characters';
import ViewCharacterList from 'pages/ViewCharacterList/template';
import { ICharacterData, IOnMoveDown, IOnMoveUp, IOnDelete } from 'modules/character-data';

interface IStateToProps {
	characters: ICharacterData[];
}

interface IViewCharacterListContainerProps extends RouteComponentProps<any> {
	onMoveDown: IOnMoveDown;
	onMoveUp: IOnMoveUp;
	onDelete: IOnDelete;
}

const mapStateToProps = (state: IStore): IStateToProps => ({
	characters: Selector.getCharacters(state)
});

const mapDispatchToProps = (dispatch: Dispatch<Action<ICharacterData>>) => ({
	onMoveDown: (char: ICharacterData) => () => {
		dispatch(Actions.moveDownList(char));
	},
	onMoveUp: (char: ICharacterData) => () => {
		dispatch(Actions.moveUpList(char));
	},
	onDelete: (char: ICharacterData, name: string) => () => {
		if (confirm(`Do you realy want to delete "${name}"?`)) {
			dispatch(Actions.removeCharacter(char));
		}
	}
});

const ViewCharacterListContainer: React.SFC<IViewCharacterListContainerProps & IStateToProps> = props => {
	const { characters, history, onMoveDown, onMoveUp, onDelete } = props;

	return (
		<ViewCharacterList
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
	connect(mapStateToProps, mapDispatchToProps)(ViewCharacterListContainer)
);
