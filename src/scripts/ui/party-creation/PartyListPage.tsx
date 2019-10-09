import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router';

import { gotoFn } from 'core/navigation';
import { withContext, IContext } from 'context';

import { Store } from 'modules/store';

import Page from 'ui/common/Page';
import Button from 'ui/common/Button';
import ButtonRow from 'ui/common/ButtonRow';
import Separator from 'ui/common/Separator';
import PartyList from 'ui/party-creation/PartyList';

const onMoveDown = (store: Store) => (id: string) => () => {
	store.parties.moveDown(id);
	store.save();
};

const onMoveUp = (store: Store) => (id: string) => () => {
	store.parties.moveUp(id);
	store.save();
};

const onDelete = (store: Store) => (id: string) => () => {
	if (confirm('Do you realy want to delete this party?')) {
		store.parties.remove(id);
		store.save();
	}
};

const PartyListPageContainer: React.SFC<IContext> = ({ store }) => {
	const history = useHistory();
	return (
		<Page heading="Party list">
			{store.parties.data.length
				? <PartyList
					parties={store.parties.data}
					onDelete={onDelete(store)}
					onMoveUp={onMoveUp(store)}
					onMoveDown={onMoveDown(store)}
				/>
				: <p className="Paragraph">There are no character parties.</p>
			}
			<Separator />

			<ButtonRow>
				<Button ico="back" text="Back" onClick={gotoFn(history, 'ROOT')} />

				<Button
					ico="create"
					color="green"
					text="Create new party"
					onClick={gotoFn(history, 'PARTY_CREATE')}
				/>
			</ButtonRow>
		</Page>
	);
};

export default withContext(
	observer(PartyListPageContainer)
);
