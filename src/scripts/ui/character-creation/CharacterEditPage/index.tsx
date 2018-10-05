import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { Store } from 'store';
import { goto, gotoFn } from 'utils/nav';
import { withContext, IContext } from 'context';
import { CharacterData } from 'engine/character-data';

import Page from 'ui/common/Page';
import CharacterCreation from 'ui/character-creation/CharacterCreation';

const onSubmit = (store: Store, history: History) => (char: CharacterData) => {
	store.characters.replace(char);
	store.save();

	goto(history, '/character-list');
};

const CharacterEditPageContainer: React.SFC<RouteComponentProps<any> & IContext> = props => {
	const { store, history, match } = props;
	const character = store.characters.getById(match.params.id);

	return (
		<Page heading="Edit character">
			<CharacterCreation
				character={character}
				onBack={gotoFn(history, '/character-list')}
				onSubmit={onSubmit(store, history)}
			/>
		</Page>
	);
};

export default withRouter(
	withContext(CharacterEditPageContainer)
);
