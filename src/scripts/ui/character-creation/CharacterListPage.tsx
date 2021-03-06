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
import CharacterList from 'ui/character-creation/CharacterList';

const onMoveDown = (store: Store) => (id: string) => () => {
	store.characters.moveDown(id);
	store.save();
};

const onMoveUp = (store: Store) => (id: string) => () => {
	store.characters.moveUp(id);
	store.save();
};

const onDelete = (store: Store) => (id: string) => () => {
	if (confirm('Do you realy want to delete this character?')) {
		const included: string[] = [];

		for (const party of store.parties.data) {
			if (party.slots.find(slot => id === slot)) {
				included.push(party.name);
			}
		}

		if (included.length) {
			return alert(`Could not delete character because he is included in party (${included.join(', ')})`);
		}

		store.characters.remove(id);
		store.save();
	}
};

const CharacterListPageContainer: React.SFC<IContext> = ({ store }) => {
	const history = useHistory();
	const characters = store.characters.data;
	return (
		<Page heading="Character list">
			{characters.length
				? <CharacterList
					editable={true}
					characters={characters}
					onDelete={onDelete(store)}
					onMoveDown={onMoveDown(store)}
					onMoveUp={onMoveUp(store)}
				/>
				: <p className="Paragraph">There are no characters.</p>
			}
			<Separator />

			<ButtonRow>
				<Button ico="back" text="Back" onClick={gotoFn(history, 'ROOT')} />
				<Button
					ico="create"
					color="green"
					text="Create new Character"
					onClick={gotoFn(history, 'CHARACTER_CREATE')}
				/>
			</ButtonRow>
		</Page>
	);
};

export default withContext(
	observer(CharacterListPageContainer)
);
