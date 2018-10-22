import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { gotoFn } from 'core/navigation';
import { withContext, IContext } from 'context';

import { Store } from 'modules/store';
import { PartyData } from 'modules/party-creation/party-data';

import Page from 'ui/common/Page';
import Button from 'ui/common/Button';
import ButtonRow from 'ui/common/ButtonRow';
import Separator from 'ui/common/Separator';
import PartyList from 'ui/party-creation/PartyList';

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
		<Page heading="Party list">
			{store.parties.data.length
				? <PartyList
					parties={store.parties}
					onDelete={onDelete(store)}
					onMoveUp={onMoveUp(store)}
					onMoveDown={onMoveDown(store)}
				/>
				: <p className="Paragraph">There are no character parties.</p>
			}
			<Separator />

			<ButtonRow>
				<Button ico="back" text="Back" onClick={gotoFn(history, '/')} />

				<Button
					ico="create"
					color="green"
					text="Create new party"
					onClick={gotoFn(history, '/party-create')}
				/>
			</ButtonRow>
		</Page>
	);
};

export default withRouter(
	withContext(PartyListPageContainer)
);
