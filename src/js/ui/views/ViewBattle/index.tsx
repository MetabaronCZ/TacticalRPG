import React from 'react';
import { History } from 'history';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Game from 'ui/components/Game';
import { goto, gotoFn } from 'utils/nav';
import { IState } from 'store';
import { IPartyData } from 'models/party';
import { ICharacterData } from 'models/character';

const txtExitConfirm = 'Do you realy want to exit and lost your game progress?';

type IOnExit = () => void;

const exit = (history: History): IOnExit => (): void => {
	if (window.confirm(txtExitConfirm)) {
		// go to Main Menu
		goto(history, '/');
	}
};

const mapStateToProps = (state: IState) => ({
	characters: state.characters,
	parties: state.parties
});

interface IViewCharacterEditContainerProps {
	characters: ICharacterData[];
	parties: IPartyData[];
	history: History;
	match: any;
}

const ViewCharacterEditContainer = ({ characters, parties, history, match }: IViewCharacterEditContainerProps): JSX.Element => {
	const partyID = match.params.party;
	const party = parties.find((p) => p.id === partyID);
	const onExit = exit(history);

	if (!party) {
		throw new Error(`Game started with invalid party ID ${partyID}`);
	}
	return (
		<Game
			party={party}
			characters={characters}
			onExit={onExit}
			onSummary={gotoFn(history, '/battle-summary')}
		/>
	);
};

export default withRouter(
	connect(mapStateToProps, null)(ViewCharacterEditContainer as any)
);
