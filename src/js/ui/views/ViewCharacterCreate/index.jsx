import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { goto, gotoFn } from 'utils/nav';
import actions from 'ui/actions/characters';
import Page from 'ui/components/Page';
import CharacterCreation from 'ui/components/CharacterCreation';

const mapDispatchToProps = dispatch => ({
	onSubmit: history => value => {
		dispatch(actions.addCharacter(value));
		goto(history, '/character-list');
	}
});

const ViewCharacterCreateContainer = ({ onSubmit, history }) => (
	<Page heading="Character creation">
		<CharacterCreation
			onBack={gotoFn(history, '/character-list')}
			onSubmit={onSubmit(history)}
		/>
	</Page>
);

export default withRouter(connect(
	null,
	mapDispatchToProps
)(ViewCharacterCreateContainer));
