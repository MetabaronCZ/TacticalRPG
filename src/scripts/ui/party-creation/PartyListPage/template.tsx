import React from 'react';

import Page from 'ui/common/Page';
import Button from 'ui/common/Button';
import ButtonRow from 'ui/common/ButtonRow';
import Separator from 'ui/common/Separator';
import PartyList, { IOnMoveDown, IOnMoveUp, IOnDelete } from 'ui/party-creation/PartyList';

import { IPartyData } from 'engine/party-data';

const NoParties = () => (
	<p className="Paragraph">There are no character parties.</p>
);

interface IPartyListPage {
	readonly parties: IPartyData[];
	readonly onBack?: () => void;
	readonly onCreate?: () => void;
	readonly onMoveDown: IOnMoveDown;
	readonly onMoveUp: IOnMoveUp;
	readonly onDelete: IOnDelete;
}

const PartyListPage: React.SFC<IPartyListPage> = props => {
	const { parties, onBack, onCreate, onMoveDown, onMoveUp, onDelete } = props;

	return (
		<Page heading="Party list">
			{
				(parties && parties.length)
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
};

export default PartyListPage;
