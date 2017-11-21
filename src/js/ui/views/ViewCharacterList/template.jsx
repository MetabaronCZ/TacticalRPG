import React from 'react';
import Page from 'ui/components/Page';
import Button from 'ui/components/Button';
import ButtonRow from 'ui/components/ButtonRow';
import CharacterList from 'ui/components/CharacterList';
import Separator from 'ui/components/Separator';

const NoCharacters = () => (
	<p className="Paragraph">There are no characters.</p>
);

const ViewCharacterList = ({ characters, onBack, onCreate, onDelete, onMoveDown, onMoveUp }) => (
	<Page heading="Character list">
		{
			characters.length
				? <CharacterList
					editable="true"
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
