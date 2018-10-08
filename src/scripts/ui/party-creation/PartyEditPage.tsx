import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { Store } from 'store';
import { goto, gotoFn } from 'core/navigation';
import { withContext, IContext } from 'context';
import { PartyData } from 'engine/party-data';

import Page from 'ui/common/Page';
import PartyCreationUI from 'ui/party-creation/PartyCreationUI';

const onSubmit = (store: Store, history: History) => (party: PartyData) => {
	store.parties.replace(party);
	store.save();

	goto(history, '/party-list');
};

const PartyEditPageContainer: React.SFC<RouteComponentProps<any> & IContext> = props => {
	const { store, history, match } = props;
	const { characters, parties } = store;
	const party = parties.data.find(c => c.id === match.params.id);

	return (
		<Page heading="Edit party">
			<PartyCreationUI
				party={party}
				characters={characters}
				onBack={gotoFn(history, '/party-list')}
				onSubmit={onSubmit(store, history)}
			/>
		</Page>
	);
};

export default withRouter(
	withContext(PartyEditPageContainer)
);
