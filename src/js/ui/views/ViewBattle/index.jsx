import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Game from 'ui/components/Game';
import { goto, gotoFn } from 'utils/nav';
import { getCharacterById } from 'utils/party';

const txtExitConfirm = 'Do you realy want to exit and lost your game progress?';

const exit = history => () => {
	if ( window.confirm(txtExitConfirm) ){
		// go to Main Menu
		goto(history, '/');
	}
};

// obtain all character data from party ID
const getParty = (partyId, characters, parties) => {
	let party = parties.find(p => p.id === partyId);
	party.characters = party.characters.map(id => getCharacterById(id, characters));
	return party;
};

const mapStateToProps = state => ({
	characters: state.characters,
	parties: state.parties
});

const ViewCharacterEditContainer = ({ characters, parties, history, match }) => {
	let party = getParty(match.params.party, characters, parties);
	let onExit = exit(history);

	return (
		<Game
			party={party}
			onExit={onExit}
			onSummary={gotoFn(history, '/battle-summary')}
		/>
	);
};

export default withRouter(connect(
	mapStateToProps,
	null
)(ViewCharacterEditContainer));
