import React from 'react';

import Page from 'components/Page';
import Button from 'components/Button';
import ButtonRow from 'components/ButtonRow';
import PartyList from 'components/PartyList';
import Separator from 'components/Separator';

import { IParty, IOnMoveDown, IOnMoveUp, IOnDelete } from 'modules/party';

const NoParties = () => (
	<p className="Paragraph">There are no character parties.</p>
);

interface IViewPartyList {
	readonly parties?: IParty[];
	readonly onBack?: () => void;
	readonly onCreate?: () => void;
	readonly onMoveDown: IOnMoveDown;
	readonly onMoveUp: IOnMoveUp;
	readonly onDelete: IOnDelete;
}

const ViewPartyList: React.SFC<IViewPartyList> = props => {
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

export default ViewPartyList;
