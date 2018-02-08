import React from 'react';
import { History } from 'history';
import { connect, Dispatch } from 'react-redux';
import { withRouter } from 'react-router';

import Page from 'ui/components/Page';
import CharacterCreation from 'ui/components/CharacterCreation';

import { goto, gotoFn } from 'utils/nav';
import actions from 'actions/characters';
import { IState, IAction } from 'store';
import { ICharacterData } from 'models/character';

const mapStateToProps = (state: IState) => ({
	characters: state.characters
});

const mapDispatchToProps = (dispatch: Dispatch<IAction>) => ({
	onSubmit: (history: History) => (char: ICharacterData) => {
		dispatch(actions.editCharacter(char));
		goto(history, '/character-list');
	}
});

interface IViewCharacterEditContainerProps {
	characters: ICharacterData[];
	onSubmit: (history: History) => any;
	history: History;
	match: any;
}

const ViewCharacterEditContainer = ({ characters, onSubmit, history, match }: IViewCharacterEditContainerProps): JSX.Element => {
	const charID = match.params.id;
	const character = characters.find((char) => char.id === charID);

	return (
		<Page heading="Edit character">
			<CharacterCreation
				character={character}
				onBack={gotoFn(history, '/character-list')}
				onSubmit={onSubmit(history)}
			/>
		</Page>
	);
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(ViewCharacterEditContainer as any)
);