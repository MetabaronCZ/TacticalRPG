import React from 'react';
import Page from 'ui/components/Page';
import Button from 'ui/components/Button';
import ButtonRow from 'ui/components/ButtonRow';
import PartyList from 'ui/components/PartyList';
import Separator from 'ui/components/Separator';
import { IPartyData } from 'models/party';

const NoParties = () => (
	<p className="Paragraph">There are no character parties.</p>
);

interface IViewPartyList {
	parties?: IPartyData[];
	onBack?: () => void;
	onCreate?: () => void;
	onMoveDown?: (id: string) => void;
	onMoveUp?: (id: string) => void;
	onDelete?: () => void;
}

const ViewPartyList: React.SFC<IViewPartyList> = (props) => {
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
