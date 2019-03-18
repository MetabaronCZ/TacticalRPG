import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { withContext, IContext } from 'context';
import { gotoRoute, gotoFn } from 'core/navigation';

import { Store } from 'modules/store';
import { CharacterData } from 'modules/character-creation/character-data';

import Page from 'ui/common/Page';
import CharacterCreation from 'ui/character-creation/CharacterCreationUI';

const onSubmit = (store: Store, history: History) => (char: CharacterData): void => {
	store.characters.add(char);
	store.save();

	gotoRoute(history, 'CHARACTER_LIST');
};

const CharacterCreationPageContainer: React.SFC<RouteComponentProps<any> & IContext> = ({ store, history }) => (
	<Page heading="Character creation">
		<CharacterCreation
			character={null}
			onBack={gotoFn(history, 'CHARACTER_LIST')}
			onSubmit={onSubmit(store, history)}
		/>
	</Page>
);

export default withRouter(
	withContext(CharacterCreationPageContainer)
);
