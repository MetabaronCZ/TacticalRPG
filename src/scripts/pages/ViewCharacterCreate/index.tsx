import React from 'react';
import { History } from 'history';
import { Action } from 'redux-actions';
import { connect, Dispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import Page from 'components/Page';
import CharacterCreation from 'components/CharacterCreation';

import { goto, gotoFn } from 'utils/nav';
import Actions from 'actions/characters';
import { ICharacterData } from 'modules/character-data/types';

interface IViewCharacterCreateContainerProps extends RouteComponentProps<any> {
	readonly onSubmit: (history: History) => (data: ICharacterData) => void;
	readonly onBack: () => void;
}

const mapDispatchToProps = (dispatch: Dispatch<Action<ICharacterData>>) => ({
	onSubmit: (history: History) => (value: ICharacterData): void => {
		dispatch(Actions.addCharacter(value));
		goto(history, '/character-list');
	}
});

const ViewCharacterCreateContainer: React.SFC<IViewCharacterCreateContainerProps> = ({ onSubmit, history }) => (
	<Page heading="Character creation">
		<CharacterCreation
			onBack={gotoFn(history, '/character-list')}
			onSubmit={onSubmit(history)}
		/>
	</Page>
);

export default withRouter(
	connect(null, mapDispatchToProps)(ViewCharacterCreateContainer)
);
