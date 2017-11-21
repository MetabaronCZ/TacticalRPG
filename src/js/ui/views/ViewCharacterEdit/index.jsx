import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { goto, gotoFn } from 'utils/nav';
import actions from 'ui/actions/characters';
import Page from 'ui/components/Page';
import CharacterCreation from 'ui/components/CharacterCreation';

const mapStateToProps = state => ({
	characters: state.characters
});

const mapDispatchToProps = dispatch => ({
	onSubmit: history => char => {
		dispatch(actions.editCharacter(char));
		goto(history, '/character-list');
	}
});
const ViewCharacterEditContainer = ({ characters, onSubmit, history, match }) => {
	let character = characters.find(c => c.id === match.params.id);

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

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(ViewCharacterEditContainer));
