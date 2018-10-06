import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { Store } from 'store';
import { goto, gotoFn } from 'core/navigation';
import { withContext, IContext } from 'context';
import { CharacterData } from 'engine/character-data';

import Page from 'ui/common/Page';
import CharacterCreation from 'ui/character-creation/CharacterCreation';

const onSubmit = (store: Store, history: History) => (char: CharacterData): void => {
	store.characters.add(char);
	store.save();

	goto(history, '/character-list');
};

const CharacterCreationPageContainer: React.SFC<RouteComponentProps<any> & IContext> = ({ store, history }) => (
	<Page heading="Character creation">
		<CharacterCreation
			character={null}
			onBack={gotoFn(history, '/character-list')}
			onSubmit={onSubmit(store, history)}
		/>
	</Page>
);

export default withRouter(
	withContext(CharacterCreationPageContainer)
);
