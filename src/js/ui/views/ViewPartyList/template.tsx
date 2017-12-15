import React from 'react';
import Page from 'ui/components/Page';
import Button from 'ui/components/Button';
import ButtonRow from 'ui/components/ButtonRow';
import PartyList from 'ui/components/PartyList';
import Separator from 'ui/components/Separator';
import { IParty } from 'models/party';

const NoParties = (): JSX.Element => (
	<p className="Paragraph">There are no character parties.</p>
);

interface IViewPartyList {
	parties: IParty[];
	onBack?: () => void;
	onCreate?: () => void;
	onMoveDown?: (id: string) => void;
	onMoveUp?: (id: string) => void;
	onDelete?: () => void;
}

const ViewPartyList = ({ parties, onBack, onCreate, onMoveDown, onMoveUp, onDelete }: IViewPartyList): JSX.Element => (
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
