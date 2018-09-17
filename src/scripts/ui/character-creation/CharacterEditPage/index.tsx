import React from 'react';
import { Dispatch } from 'redux';
import { History } from 'history';
import { Action } from 'redux-actions';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { IStore } from 'store';
import * as Selector from 'selectors';
import Actions from 'actions/characters';
import { goto, gotoFn } from 'utils/nav';
import { CharacterData } from 'engine/character-data';

import Page from 'ui/common/Page';
import CharacterCreation from 'ui/character-creation/CharacterCreation';

interface IStateToProps {
	readonly characters: CharacterData[];
}

interface ICharacterEditPageContainerProps extends RouteComponentProps<any> {
	readonly onSubmit: (history: History) => (data: CharacterData) => void;
}

const mapStateToProps = (state: IStore): IStateToProps => ({
	characters: Selector.getCharacters(state)
});

const mapDispatchToProps = (dispatch: Dispatch<Action<CharacterData>>) => ({
	onSubmit: (history: History) => (char: CharacterData) => {
		dispatch(Actions.editCharacter(char));
		goto(history, '/character-list');
	}
});

const CharacterEditPageContainer: React.SFC<ICharacterEditPageContainerProps & IStateToProps> = props => {
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
	connect(mapStateToProps, mapDispatchToProps)(CharacterEditPageContainer)
);
