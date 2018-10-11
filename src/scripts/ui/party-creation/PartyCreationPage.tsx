import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { goto, gotoFn } from 'core/navigation';
import { withContext, IContext } from 'context';

import { Store } from 'engine/store';
import { PartyData } from 'engine/party-creation/party-data';

import Page from 'ui/common/Page';
import PartyCreationUI from 'ui/party-creation/PartyCreationUI';

const onSubmit = (store: Store, history: History) => (party: PartyData): void => {
	store.parties.add(party);
	store.save();

	goto(history, '/party-list');
};

const PartyCreationPageContainer: React.SFC<RouteComponentProps<any> & IContext> = props => {
	const { store, history } = props;
	return (
		<Page heading="Party creation">
			<PartyCreationUI
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
