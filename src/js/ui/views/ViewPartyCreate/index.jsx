import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { goto, gotoFn } from 'utils/nav';
import actions from 'ui/actions/parties';
import Page from 'ui/components/Page';
import PartyCreation from 'ui/components/PartyCreation';

const mapStateToProps = state => ({
	characters: state.characters
});

const mapDispatchToProps = dispatch => ({
	onSubmit: history => value => {
		dispatch(actions.addParty(value));
		goto(history, '/party-list');
	}
});

const ViewPartyCreateContainer = ({ characters, onSubmit, history }) => (
	<Page heading="Party creation">
		<PartyCreation
			characters={characters}
			onBack={gotoFn(history, '/party-list')}
			onSubmit={onSubmit(history)}
		/>
	</Page>
);

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(ViewPartyCreateContainer));
