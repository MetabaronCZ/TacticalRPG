import React from 'react';
import { connect, Dispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { IStore } from 'store';
import { gotoFn } from 'utils/nav';
import * as Selector from 'selectors';
import Actions from 'actions/characters';
import { ICharacterData } from 'modules/character-data';
import ViewCharacterList from 'pages/ViewCharacterList/template';

export type IOnMoveDown = (char: ICharacterData) => () => void;
export type IOnMoveUp = (char: ICharacterData) => () => void;
export type IOnDelete = (char: ICharacterData, name: string) => () => void;

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

const mapDispatchToProps = (dispatch: Dispatch<ICharacterData>) => ({
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
