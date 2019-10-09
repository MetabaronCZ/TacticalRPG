import React from 'react';
import { History } from 'history';
import { useHistory, useParams } from 'react-router';

import { withContext, IContext } from 'context';
import { gotoRoute, gotoFn } from 'core/navigation';

import { Store } from 'modules/store';
import { IPartyData } from 'modules/party-creation/party-data';

import Page from 'ui/common/Page';
import PartyCreationUI from 'ui/party-creation/PartyCreationUI';

const onSubmit = (store: Store, history: History) => (party: IPartyData) => {
	store.parties.replace(party);
	store.save();

	gotoRoute(history, 'PARTY_LIST');
};

const PartyEditPageContainer: React.SFC<IContext> = ({ store }) => {
	const history = useHistory();
	const { id } = useParams();
	const party = store.parties.data.find(c => c.id === id);
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

export default withContext(PartyEditPageContainer);
