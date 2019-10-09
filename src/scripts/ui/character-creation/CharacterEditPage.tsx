import React from 'react';
import { History } from 'history';
import { useHistory, useParams } from 'react-router';

import { withContext, IContext } from 'context';
import { gotoRoute, gotoFn } from 'core/navigation';

import { Store } from 'modules/store';
import { ICharacterData } from 'modules/character-creation/character-data';

import Page from 'ui/common/Page';
import CharacterCreation from 'ui/character-creation/CharacterCreationUI';

const onSubmit = (store: Store, history: History) => (char: ICharacterData) => {
	store.characters.replace(char);
	store.save();

	gotoRoute(history, 'CHARACTER_LIST');
};

const CharacterEditPageContainer: React.SFC<IContext> = ({ store }) => {
	const history = useHistory();
	const { id } = useParams();
	const character = store.characters.getById(id || '') || null;
	return (
		<Page heading="Edit character">
			<CharacterCreation
				character={character}
				onBack={gotoFn(history, 'CHARACTER_LIST')}
				onSubmit={onSubmit(store, history)}
			/>
		</Page>
	);
};

export default withContext(CharacterEditPageContainer);
