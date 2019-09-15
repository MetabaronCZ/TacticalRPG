import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { withContext, IContext } from 'context';
import { gotoRoute, gotoFn } from 'core/navigation';

import { Store } from 'modules/store';
import { IRouteParams } from 'modules/route';
import { IPartyData } from 'modules/party-creation/party-data';

import Page from 'ui/common/Page';
import PartyCreationUI from 'ui/party-creation/PartyCreationUI';

const onSubmit = (store: Store, history: History) => (party: IPartyData) => {
	store.parties.replace(party);
	store.save();

	gotoRoute(history, 'PARTY_LIST');
};

const PartyEditPageContainer: React.SFC<RouteComponentProps<IRouteParams> & IContext> = props => {
	const { store, history, match } = props;
	const party = store.parties.data.find(c => c.id === match.params.id);
	return (
		<Page heading="Edit party">
			<PartyCreationUI
				party={party}
				characters={store.characters.data}
				onBack={gotoFn(history, 'PARTY_LIST')}
				onSubmit={onSubmit(store, history)}
			/>
		</Page>
	);
};

export default withRouter(
	withContext(PartyEditPageContainer)
);
