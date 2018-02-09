import React from 'react';
import { connect, Dispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { gotoFn } from 'utils/nav';
import ViewCharacterList from 'ui/views/ViewCharacterList/template';
import { IState, IAction } from 'store';
import actions from 'actions/characters';
import { ICharacterData } from 'models/character';

export type IOnMoveDown = (id: string) => () => void;
export type IOnMoveUp = (id: string) => () => void;
export type IOnDelete = (id: string, name: string) => () => void;

interface IStateToProps {
	characters?: ICharacterData[];
}

interface IViewCharacterListContainerProps extends RouteComponentProps<any> {
	onMoveDown?: IOnMoveDown;
	onMoveUp?: IOnMoveUp;
	onDelete?: IOnDelete;
}

const mapStateToProps = (state: IState): IStateToProps => ({
	characters: state.characters
});

const mapDispatchToProps = (dispatch: Dispatch<IAction>) => ({
	onMoveDown: (id: string) => () => {
		dispatch(actions.moveDownList(id));
	},
	onMoveUp: (id: string) => () => {
		dispatch(actions.moveUpList(id));
	},
	onDelete: (id: string, name: string) => () => {
		if (confirm(`Do you realy want to delete "${name}"?`)) {
			dispatch(actions.removeCharacter(id));
		}
	}
});

const ViewCharacterListContainer: React.SFC<IViewCharacterListContainerProps & IStateToProps> = ({ characters, history, onMoveDown, onMoveUp, onDelete }) => (
	<ViewCharacterList
		characters={characters}
		onBack={gotoFn(history, '/')}
		onCreate={gotoFn(history, '/character-create')}
		onMoveDown={onMoveDown}
		onMoveUp={onMoveUp}
		onDelete={onDelete}
	/>
);

export default withRouter(
	connect<IStateToProps>(mapStateToProps, mapDispatchToProps)(ViewCharacterListContainer)
);
