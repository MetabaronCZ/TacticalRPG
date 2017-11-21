import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { goto, gotoFn } from 'utils/nav';
import actions from 'ui/actions/parties';
import Page from 'ui/components/Page';
import PartyCreation from 'ui/components/PartyCreation';

const mapStateToProps = state => ({
	parties: state.parties,
	characters: state.characters
});

const mapDispatchToProps = dispatch => ({
	onSubmit: history => party => {
		dispatch(actions.editParty(party));
		goto(history, '/party-list');
	}
});
const ViewPartyEditContainer = ({ parties, characters, onSubmit, history, match }) => {
	let party = parties.find(c => c.id === match.params.id);

	return (
		<Page heading="Edit party">
			<PartyCreation
				party={party}
				characters={characters}
				onBack={gotoFn(history, '/party-list')}
				onSubmit={onSubmit(history)}
			/>
		</Page>
	);
};

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(ViewPartyEditContainer));
