import React from 'react';
import { History } from 'history';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { IState } from 'store';
import { goto, gotoFn } from 'utils/nav';

import { IParty } from 'models/party';
import { ICharacterData } from 'models/character-data';

import GameUIContainer from 'components/Game';

const txtExitConfirm = 'Do you realy want to exit and lost your game progress?';

interface IStateToProps {
	characters: ICharacterData[];
	parties: IParty[];
}

const exit = (history: History) => () => {
	if (window.confirm(txtExitConfirm)) {
		// go to Main Menu
		goto(history, '/');
	}
};

const mapStateToProps = (state: IState): IStateToProps => ({
	characters: state.app.characters,
	parties: state.app.parties
});

const ViewCharacterEditContainer: React.SFC<IStateToProps & RouteComponentProps<any>> = props => {
	const { characters, parties, history, match } = props;
	const partyID = match.params.party;
	const party = (parties ? parties.find(p => p.id === partyID) : undefined);
	const onExit = exit(history);

	if (!party || !characters) {
		throw new Error('Game started with invalid arguments');
	}
	return (
		<GameUIContainer
			party={party}
			characters={characters}
			onExit={onExit}
			onSummary={gotoFn(history, '/battle-summary')}
		/>
	);
};

export default withRouter(
	connect(mapStateToProps)(ViewCharacterEditContainer)
);
