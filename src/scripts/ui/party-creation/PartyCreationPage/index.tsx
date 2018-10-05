import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { Store } from 'store';
import { goto, gotoFn } from 'utils/nav';
import { withContext, IContext } from 'context';

import { PartyData } from 'engine/party-data';

import Page from 'ui/common/Page';
import PartyCreation from 'ui/party-creation/PartyCreation';

const onSubmit = (store: Store, history: History) => (party: PartyData): void => {
	store.parties.add(party);
	store.save();

	goto(history, '/party-list');
};

const PartyCreationPageContainer: React.SFC<RouteComponentProps<any> & IContext> = props => {
	const { store, history } = props;
	return (
		<Page heading="Party creation">
			<PartyCreation
				characters={store.characters}
				onBack={gotoFn(history, '/party-list')}
				onSubmit={onSubmit(store, history)}
			/>
		</Page>
	);
};

export default withRouter(
	withContext(PartyCreationPageContainer)
);
