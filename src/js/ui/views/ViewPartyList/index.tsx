import React from 'react';
import { History } from 'history';

import { connect, Dispatch } from 'react-redux';
import { withRouter } from 'react-router';

import { gotoFn } from 'utils/nav';
import ViewPartyList from 'ui/views/ViewPartyList/template';

import actions from 'ui/actions/parties';
import { IState, IAction } from 'ui/store';
import { IParty } from 'models/party';

const mapStateToProps = (state: IState) => ({
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

interface IViewPartyListContainer {
	parties: IParty[];
	history: History;
	onMoveDown?: (id: string) => void;
	onMoveUp?: (id: string) => void;
	onDelete?: () => void;
}

const ViewPartyListContainer = ({ parties, history, onMoveDown, onMoveUp, onDelete }: IViewPartyListContainer): JSX.Element => {
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
	connect(mapStateToProps, mapDispatchToProps)(ViewPartyListContainer as any)
);
