import React from 'react';
import { History } from 'history';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import GameUI from 'ui/components/Game';
import { goto, gotoFn } from 'utils/nav';
import { IState } from 'store';
import { IPartyData } from 'models/party';
import { ICharacterData } from 'models/character-data';

const txtExitConfirm = 'Do you realy want to exit and lost your game progress?';

type IOnExit = () => void;

interface IStateToProps {
	characters?: ICharacterData[];
	parties?: IPartyData[];
}

const exit = (history: History): IOnExit => (): void => {
	if (window.confirm(txtExitConfirm)) {
		// go to Main Menu
		goto(history, '/');
	}
};

const mapStateToProps = (state: IState): IStateToProps => ({
	characters: state.characters,
	parties: state.parties
});

const ViewCharacterEditContainer: React.SFC<IStateToProps & RouteComponentProps<any>> = (props) => {
	const { characters, parties, history, match } = props;
	const partyID = match.params.party;
	const party = (parties ? parties.find((p) => p.id === partyID) : undefined);
	const onExit = exit(history);

	if (!party || !characters) {
		throw new Error('Game started with invalid arguments');
	}
	return (
		<GameUI
			party={party}
			characters={characters}
			onExit={onExit}
			onSummary={gotoFn(history, '/battle-summary')}
		/>
	);
};

export default withRouter(
	connect<IStateToProps>(mapStateToProps)(ViewCharacterEditContainer)
);
