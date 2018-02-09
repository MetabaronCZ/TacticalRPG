import React from 'react';

import Page from 'ui/components/Page';
import Button from 'ui/components/Button';
import ButtonRow from 'ui/components/ButtonRow';
import CharacterList from 'ui/components/CharacterList';
import Separator from 'ui/components/Separator';
import { IOnMoveDown, IOnMoveUp, IOnDelete } from 'ui/views/ViewCharacterList';

import { ICharacterData } from 'models/character';

const NoCharacters = () => (
	<p className="Paragraph">There are no characters.</p>
);

interface IViewCharacterListProps {
	characters?: ICharacterData[];
	onBack?: () => void;
	onCreate?: () => void;
	onDelete?: IOnDelete;
	onMoveDown?: IOnMoveDown;
	onMoveUp?: IOnMoveUp;
}

const ViewCharacterList: React.SFC<IViewCharacterListProps> = ({ characters, onBack, onCreate, onDelete, onMoveDown, onMoveUp }) => (
	<Page heading="Character list">
		{
			characters && characters.length
				? <CharacterList
					editable={true}
					characters={characters}
					onDelete={onDelete}
					onMoveDown={onMoveDown}
					onMoveUp={onMoveUp}
				/>
				: <NoCharacters />
		}

		<Separator />

		<ButtonRow>
			<Button ico="back" text="Back" onClick={onBack} />
			<Button ico="create" color="green" text="Create new Character" onClick={onCreate} />
		</ButtonRow>
	</Page>
);

export default ViewCharacterList;
