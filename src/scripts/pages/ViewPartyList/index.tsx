import React from 'react';
import { connect, Dispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import ViewPartyList from 'pages/ViewPartyList/template';

import { gotoFn } from 'utils/nav';
import { IParty } from 'models/party';
import { IState, IAction } from 'store';
import actions from 'actions/app/parties';

export type IOnMoveDown = (id: string) => () => void;
export type IOnMoveUp = (id: string) => () => void;
export type IOnDelete = (id: string, name: string) => () => void;

interface IStateToProps {
	parties: IParty[];
}

interface IViewPartyListContainerProps extends RouteComponentProps<any> {
	onMoveDown: IOnMoveDown;
	onMoveUp: IOnMoveUp;
	onDelete: IOnDelete;
}

const mapStateToProps = (state: IState): IStateToProps => ({
	parties: state.app.parties
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
			dispatch(actions.removeParty(id));
		}
	}
});

const ViewPartyListContainer: React.SFC<IViewPartyListContainerProps & IStateToProps> = (props) => {
	const { parties, history, onMoveDown, onMoveUp, onDelete } = props;
	const fnCreate = gotoFn(history, '/party-create');
	const fnGoBack = gotoFn(history, '/');

	return (
		<ViewPartyList
			parties={parties}
			onBack={fnGoBack}
			onCreate={fnCreate}
			onMoveDown={onMoveDown}
			onMoveUp={onMoveUp}
			onDelete={onDelete}
		/>
	);
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(ViewPartyListContainer)
);
