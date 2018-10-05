import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { Store } from 'store';
import { gotoFn } from 'utils/nav';
import { withContext, IContext } from 'context';

import { PartyData } from 'engine/party-data';
import PartyListPage from 'ui/party-creation/PartyListPage/template';

const onMoveDown = (store: Store) => (party: PartyData) => () => {
	store.parties.moveDown(party);
	store.save();
};

const onMoveUp = (store: Store) => (party: PartyData) => () => {
	store.parties.moveUp(party);
	store.save();
};

const onDelete = (store: Store) => (party: PartyData) => () => {
	if (confirm(`Do you realy want to delete "${party.getName()}"?`)) {
		store.parties.remove(party);
		store.save();
	}
};

const PartyListPageContainer: React.SFC<RouteComponentProps<any> & IContext> = props => {
	const { store, history } = props;
	return (
		<PartyListPage
			parties={store.parties}
			onBack={gotoFn(history, '/')}
			onCreate={gotoFn(history, '/party-create')}
			onMoveDown={onMoveDown(store)}
			onMoveUp={onMoveUp(store)}
			onDelete={onDelete(store)}
		/>
	);
};

export default withRouter(
	withContext(PartyListPageContainer)
);
