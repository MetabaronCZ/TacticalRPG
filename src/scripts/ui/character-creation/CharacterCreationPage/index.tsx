import React from 'react';
import { Dispatch } from 'redux';
import { History } from 'history';
import { Action } from 'redux-actions';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { goto, gotoFn } from 'utils/nav';
import Actions from 'actions/characters';
import { ICharacterData } from 'engine/character-data';

import Page from 'ui/common/Page';
import CharacterCreation from 'ui/character-creation/CharacterCreation';

interface ICharacterCreationPageContainerProps extends RouteComponentProps<any> {
	readonly onSubmit: (history: History) => (data: ICharacterData) => void;
	readonly onBack: () => void;
}

const mapDispatchToProps = (dispatch: Dispatch<Action<ICharacterData>>) => ({
	onSubmit: (history: History) => (value: ICharacterData): void => {
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
