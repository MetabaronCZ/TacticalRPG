import React from 'react';
import { Dispatch } from 'redux';
import { History } from 'history';
import { Action } from 'redux-actions';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { goto, gotoFn } from 'utils/nav';
import Actions from 'actions/characters';
import { CharacterData } from 'engine/character-data';

import Page from 'ui/common/Page';
import CharacterCreation from 'ui/character-creation/CharacterCreation';

interface ICharacterCreationPageContainerProps extends RouteComponentProps<any> {
	readonly onSubmit: (history: History) => (data: CharacterData) => void;
	readonly onBack: () => void;
}

const mapDispatchToProps = (dispatch: Dispatch<Action<CharacterData>>) => ({
	onSubmit: (history: History) => (value: CharacterData): void => {
		dispatch(Actions.addCharacter(value));
		goto(history, '/character-list');
	}
});

const CharacterCreationPageContainer: React.SFC<ICharacterCreationPageContainerProps> = ({ onSubmit, history }) => (
	<Page heading="Character creation">
		<CharacterCreation
			onBack={gotoFn(history, '/character-list')}
			onSubmit={onSubmit(history)}
		/>
	</Page>
);

export default withRouter(
	connect(null, mapDispatchToProps)(CharacterCreationPageContainer)
);
