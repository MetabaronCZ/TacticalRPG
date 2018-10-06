import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { Store } from 'store';
import { gotoFn } from 'core/navigation';
import { withContext, IContext } from 'context';
import { CharacterData } from 'engine/character-data';

import CharacterListPage from 'ui/character-creation/CharacterListPage/template';

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
		<CharacterListPage
			characters={store.characters}
			onBack={gotoFn(history, '/')}
			onCreate={gotoFn(history, '/character-create')}
			onMoveDown={onMoveDown(store)}
			onMoveUp={onMoveUp(store)}
			onDelete={onDelete(store)}
		/>
	);
};

export default withRouter(
	withContext(CharacterListPageContainer)
);
