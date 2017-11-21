import React from 'react';
import Page from 'ui/components/Page';
import Button from 'ui/components/Button';
import ButtonRow from 'ui/components/ButtonRow';
import PartyList from 'ui/components/PartyList';
import Separator from 'ui/components/Separator';

const NoParties = () => (
	<p className="Paragraph">There are no character parties.</p>
);

const ViewPartyList = ({ parties, onBack, onCreate, onMoveDown, onMoveUp, onDelete }) => (
	<Page heading="Party list">
		{
			parties.length
				? <PartyList parties={parties} onDelete={onDelete} onMoveDown={onMoveDown} onMoveUp={onMoveUp} />
				: <NoParties />
		}

		<Separator />

		<ButtonRow>
			<Button ico="back" text="Back" onClick={onBack} />
			<Button ico="create" color="green" text="Create new party" onClick={onCreate} />
		</ButtonRow>
	</Page>
);

export default ViewPartyList;
