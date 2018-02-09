import React from 'react';

import { connect, Dispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { gotoFn } from 'utils/nav';
import ViewPartyList from 'ui/views/ViewPartyList/template';

import actions from 'actions/parties';
import { IState, IAction } from 'store';
import { IPartyData } from 'models/party';

interface IStateToProps {
	parties?: IPartyData[];
}

interface IViewPartyListContainer extends RouteComponentProps<any> {
	onMoveDown?: (id: string) => void;
	onMoveUp?: (id: string) => void;
	onDelete?: () => void;
}

const mapStateToProps = (state: IState): IStateToProps => ({
	parties: state.parties
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

const ViewPartyListContainer: React.SFC<IViewPartyListContainer & IStateToProps> = ({ parties, history, onMoveDown, onMoveUp, onDelete }) => {
	const fnGoBack = gotoFn(history, '/');
	const fnCreate = gotoFn(history, '/party-create');

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
	connect<IStateToProps>(mapStateToProps, mapDispatchToProps)(ViewPartyListContainer)
);
