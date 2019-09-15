import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { withContext, IContext } from 'context';
import { gotoRoute, gotoFn } from 'core/navigation';

import { Store } from 'modules/store';
import { ICharacterData } from 'modules/character-creation/character-data';

import Page from 'ui/common/Page';
import { IRouteParams } from 'modules/route';
import CharacterCreation from 'ui/character-creation/CharacterCreationUI';

const onSubmit = (store: Store, history: History) => (char: ICharacterData) => {
	store.characters.replace(char);
	store.save();

	gotoRoute(history, 'CHARACTER_LIST');
};

const CharacterEditPageContainer: React.SFC<RouteComponentProps<IRouteParams> & IContext> = props => {
	const { store, history, match } = props;
	const character = store.characters.getById(match.params.id);

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

export default withRouter(
	withContext(CharacterEditPageContainer)
);
