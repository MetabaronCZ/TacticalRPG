import React from 'react';
import { History } from 'history';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { IStore } from 'store';
import * as Selector from 'selectors';
import { goto, gotoFn } from 'utils/nav';

import { IParty } from 'modules/party';
import { ICharacterData } from 'modules/character-data';

import GameUIContainer from 'components/Game';

const txtExitConfirm = 'Do you realy want to exit and lost your game progress?';

interface IStateToProps {
	characters: ICharacterData[];
	parties: IParty[];
}

const exit = (history: History) => () => {
	 // go to Main Menu
	if (window.confirm(txtExitConfirm)) {
		goto(history, '/');
	}
};

const mapStateToProps = (state: IStore): IStateToProps => ({
	characters: Selector.getCharacters(state),
	parties: Selector.getParties(state)
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
