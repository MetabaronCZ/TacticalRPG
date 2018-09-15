import React from 'react';
import { Dispatch } from 'redux';
import { Action } from 'redux-actions';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { IStore } from 'store';
import { gotoFn } from 'utils/nav';
import * as Selector from 'selectors';
import Actions from 'actions/parties';
import { IParty, IOnMoveDown, IOnMoveUp, IOnDelete } from 'modules/party/types';

import PartyListPage from 'ui/party-creation/PartyListPage/template';

interface IStateToProps {
	readonly parties: IParty[];
}

interface IPartyListPageContainerProps extends RouteComponentProps<any> {
	readonly onMoveDown: IOnMoveDown;
	readonly onMoveUp: IOnMoveUp;
	readonly onDelete: IOnDelete;
}

const mapStateToProps = (state: IStore): IStateToProps => ({
	parties: Selector.getParties(state)
});

const mapDispatchToProps = (dispatch: Dispatch<Action<IParty>>) => ({
	onMoveDown: (party: IParty) => () => {
		dispatch(Actions.moveDownList(party));
	},
	onMoveUp: (party: IParty) => () => {
		dispatch(Actions.moveUpList(party));
	},
	onDelete: (party: IParty) => () => {
		if (confirm(`Do you realy want to delete "${party.name}"?`)) {
			dispatch(Actions.removeParty(party));
		}
	}
});

const PartyListPageContainer: React.SFC<IPartyListPageContainerProps & IStateToProps> = props => {
	const { parties, history, onMoveDown, onMoveUp, onDelete } = props;
	const fnCreate = gotoFn(history, '/party-create');
	const fnGoBack = gotoFn(history, '/');

	return (
		<PartyListPage
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
	connect(mapStateToProps, mapDispatchToProps)(PartyListPageContainer)
);
