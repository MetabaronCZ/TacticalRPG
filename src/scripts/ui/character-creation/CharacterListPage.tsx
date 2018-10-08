import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { Store } from 'store';
import { gotoFn } from 'core/navigation';
import { withContext, IContext } from 'context';
import { CharacterData } from 'engine/character-data';

import Page from 'ui/common/Page';
import Button from 'ui/common/Button';
import ButtonRow from 'ui/common/ButtonRow';
import Separator from 'ui/common/Separator';
import CharacterList from 'ui/character-creation/CharacterList';

const onMoveDown = (store: Store) => (char: CharacterData) => () => {
	store.characters.moveDown(char);
	store.save();
};

const onMoveUp = (store: Store) => (char: CharacterData) => () => {
	store.characters.moveUp(char);
	store.save();
};

const onDelete = (store: Store) => (char: CharacterData) => () => {
	if (confirm(`Do you realy want to delete "${char.name}"?`)) {
		const included: string[] = [];

		for (const party of store.parties.data) {
			if (party.getCharacters().find((ch: CharacterData|null) => !!ch && ch.id === char.id)) {
				included.push(party.getName());
			}
		}

		if (included.length) {
			return alert(`Could not delete "${char.name}": character is included in party (${included.join(', ')})`);
		}

		store.characters.remove(char);
		store.save();
	}
};

const CharacterListPageContainer: React.SFC<RouteComponentProps<any> & IContext> = props => {
	const { store, history } = props;

	return (
		<Page heading="Character list">
			{store.characters.data.length
				? <CharacterList
					editable={true}
					characters={store.characters}
					onDelete={onDelete(store)}
					onMoveDown={onMoveDown(store)}
					onMoveUp={onMoveUp(store)}
				/>
				: <p className="Paragraph">There are no characters.</p>
			}
			<Separator />

			<ButtonRow>
				<Button ico="back" text="Back" onClick={gotoFn(history, '/')} />
				<Button
					ico="create"
					color="green"
					text="Create new Character"
					onClick={gotoFn(history, '/character-create')}
				/>
			</ButtonRow>
		</Page>
	);
};

export default withRouter(
	withContext(CharacterListPageContainer)
);
