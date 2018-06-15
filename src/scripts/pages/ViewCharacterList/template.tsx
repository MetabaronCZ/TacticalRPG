import React from 'react';

import Page from 'components/Page';
import Button from 'components/Button';
import ButtonRow from 'components/ButtonRow';
import Separator from 'components/Separator';
import CharacterList from 'components/CharacterList';
import { IOnMoveDown, IOnMoveUp, IOnDelete } from 'modules/character-data';

import { ICharacterData } from 'modules/character-data';

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

const ViewCharacterList: React.SFC<IViewCharacterListProps> = props => {
	const { characters, onBack, onCreate, onDelete, onMoveDown, onMoveUp } = props;

	return (
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
};

export default ViewCharacterList;
