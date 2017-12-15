import React from 'react';
import { History } from 'history';
import { connect, Dispatch } from 'react-redux';
import { withRouter } from 'react-router';

import { goto, gotoFn } from 'utils/nav';
import actions from 'ui/actions/characters';
import Page from 'ui/components/Page';
import CharacterCreation from 'ui/components/CharacterCreation';
import { IAction } from 'ui/store';
import { ICharacter } from 'models/character';

const mapDispatchToProps = (dispatch: Dispatch<IAction>) => ({
	onSubmit: (history: History) => (value: ICharacter): void => {
		dispatch(actions.addCharacter(value));
		goto(history, '/character-list');
	}
});

interface IViewCharacterCreateContainerProps {
	onSubmit: (history: History) => any;
	onBack: () => void;
	history: History;
}

const ViewCharacterCreateContainer = ({ onSubmit, history }: IViewCharacterCreateContainerProps): JSX.Element => (
	<Page heading="Character creation">
		<CharacterCreation
			onBack={gotoFn(history, '/character-list')}
			onSubmit={onSubmit(history)}
		/>
	</Page>
);

export default withRouter(
	connect(null, mapDispatchToProps)(ViewCharacterCreateContainer as any)
);
