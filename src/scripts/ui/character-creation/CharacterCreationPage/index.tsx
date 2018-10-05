import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { Store } from '_store';
import { goto, gotoFn } from 'utils/nav';
import { withContext, IContext } from 'context';
import { CharacterData } from 'engine/character-data';

import Page from 'ui/common/Page';
import CharacterCreation from 'ui/character-creation/CharacterCreation';

interface ICharacterCreationPageContainerProps extends RouteComponentProps<any>, IContext {
	readonly onSubmit: (store: Store, history: History) => (data: CharacterData) => void;
	readonly onBack: () => void;
}

const onSubmit = (store: Store, history: History) => (char: CharacterData): void => {
	store.characters.add(char);
	store.save();
	goto(history, '/character-list');
};

const CharacterCreationPageContainer: React.SFC<ICharacterCreationPageContainerProps> = ({ store, history }) => (
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
