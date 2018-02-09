import React from 'react';
import { History } from 'history';
import { connect, Dispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import Page from 'ui/components/Page';
import CharacterCreation from 'ui/components/CharacterCreation';

import { goto, gotoFn } from 'utils/nav';
import actions from 'actions/characters';
import { IState, IAction } from 'store';
import { ICharacterData } from 'models/character';

interface IStateToProps {
	characters?: ICharacterData[];
}

interface IViewCharacterEditContainerProps extends RouteComponentProps<any> {
	onSubmit: (history: History) => any;
}

const mapStateToProps = (state: IState): IStateToProps => ({
	characters: state.characters
});

const mapDispatchToProps = (dispatch: Dispatch<IAction>) => ({
	onSubmit: (history: History) => (char: ICharacterData) => {
		dispatch(actions.editCharacter(char));
		goto(history, '/character-list');
	}
});

const ViewCharacterEditContainer: React.SFC<IViewCharacterEditContainerProps & IStateToProps> = ({ characters, onSubmit, history, match }) => {
	const charID = match.params.id;
	const character = (characters ? characters.find((char) => char.id === charID) : undefined);

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
	connect<IStateToProps>(mapStateToProps, mapDispatchToProps)(ViewCharacterEditContainer)
);
