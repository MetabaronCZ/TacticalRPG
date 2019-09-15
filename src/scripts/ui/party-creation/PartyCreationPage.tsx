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

const onSubmit = (store: Store, history: History) => (party: IPartyData): void => {
	store.parties.add(party);
	store.save();

	gotoRoute(history, 'PARTY_LIST');
};

const PartyCreationPageContainer: React.SFC<RouteComponentProps<IRouteParams> & IContext> = props => {
	const { store, history } = props;
	return (
		<Page heading="Party creation">
			<PartyCreationUI
				characters={store.characters.data}
				onBack={gotoFn(history, 'PARTY_LIST')}
				onSubmit={onSubmit(store, history)}
			/>
		</Page>
	);
};

export default withRouter(
	withContext(PartyCreationPageContainer)
);
