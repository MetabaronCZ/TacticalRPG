import React from 'react';

import CharacterList from 'engine/character-list';

import Page from 'ui/common/Page';
import Button from 'ui/common/Button';
import ButtonRow from 'ui/common/ButtonRow';
import Separator from 'ui/common/Separator';
import CharacterListUI, { IOnDelete, IOnMoveDown, IOnMoveUp } from 'ui/character-creation/CharacterList';

const NoCharacters = () => (
	<p className="Paragraph">There are no characters.</p>
);

interface ICharacterListPageProps {
	readonly characters: CharacterList;
	readonly onBack?: () => void;
	readonly onCreate?: () => void;
	readonly onDelete?: IOnDelete;
	readonly onMoveDown?: IOnMoveDown;
	readonly onMoveUp?: IOnMoveUp;
}

const CharacterListPage: React.SFC<ICharacterListPageProps> = props => {
	const { characters, onBack, onCreate, onDelete, onMoveDown, onMoveUp } = props;

	return (
		<Page heading="Character list">
			{
				characters.data.length
					? <CharacterListUI
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

export default CharacterListPage;
