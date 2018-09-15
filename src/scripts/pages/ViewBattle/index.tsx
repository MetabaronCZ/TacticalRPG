import React from 'react';
import { History } from 'history';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { IStore } from 'store';
import * as Selector from 'selectors';
import { goto, gotoFn } from 'utils/nav';

import { IParty } from 'modules/party/types';
import { IBattleConfig } from 'modules/battle-config';
import { ICharacterData } from 'modules/character-data/types';

import GameUIContainer from 'components/Game';

const txtExitConfirm = 'Do you realy want to exit and lost your game progress?';

interface IStateToProps {
	readonly battleConfig: IBattleConfig;
	readonly characters: ICharacterData[];
	readonly parties: IParty[];
}

const exit = (history: History) => () => {
	 // go to Main Menu
	if (window.confirm(txtExitConfirm)) {
		goto(history, '/');
	}
};

const mapStateToProps = (state: IStore): IStateToProps => ({
	battleConfig: Selector.getBattleConfig(state),
	characters: Selector.getCharacters(state),
	parties: Selector.getParties(state)
});

const ViewCharacterEditContainer: React.SFC<IStateToProps & RouteComponentProps<any>> = props => {
	const { characters, parties, battleConfig, history } = props;

	return (
		<GameUIContainer
			parties={parties}
			characters={characters}
			config={battleConfig}
			onExit={exit(history)}
			onSummary={gotoFn(history, '/battle-summary')}
		/>
	);
};

export default withRouter(
	connect(mapStateToProps)(ViewCharacterEditContainer)
);
