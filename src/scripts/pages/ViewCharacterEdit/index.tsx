import React from 'react';
import { History } from 'history';
import { connect, Dispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { IStore } from 'store';
import * as Selector from 'selectors';
import { goto, gotoFn } from 'utils/nav';
import Actions from 'actions/characters';
import { ICharacterData } from 'models/character-data';

import Page from 'components/Page';
import CharacterCreation from 'components/CharacterCreation';

interface IStateToProps {
	characters: ICharacterData[];
}

interface IViewCharacterEditContainerProps extends RouteComponentProps<any> {
	onSubmit: (history: History) => any;
}

const mapStateToProps = (state: IStore): IStateToProps => ({
	characters: Selector.getCharacters(state)
});

const mapDispatchToProps = (dispatch: Dispatch<ICharacterData>) => ({
	onSubmit: (history: History) => (char: ICharacterData) => {
		dispatch(Actions.editCharacter(char));
		goto(history, '/character-list');
	}
});

const ViewCharacterEditContainer: React.SFC<IViewCharacterEditContainerProps & IStateToProps> = props => {
	const { characters, onSubmit, history, match } = props;
	const character = (characters ? characters.find(char => char.id === match.params.id) : undefined);

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
	connect(mapStateToProps, mapDispatchToProps)(ViewCharacterEditContainer)
);
