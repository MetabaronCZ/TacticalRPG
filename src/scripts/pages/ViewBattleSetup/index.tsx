import React from 'react';
import { History } from 'history';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { IStore } from 'store';
import * as Selector from 'selectors';
import { goto, gotoFn } from 'utils/nav';
import Actions from 'actions/battle-config';

import Page from 'components/Page';
import BattleSetup from 'components/BattleSetup';

import { IParty } from 'modules/party/types';
import { IBattleConfig } from 'modules/battle-config';
import { ICharacterData } from 'modules/character-data/types';
import { store } from 'index';

interface IStateToProps {
	readonly battleConfig: IBattleConfig;
	readonly characters: ICharacterData[];
	readonly parties: IParty[];
}

const mapStateToProps = (state: IStore): IStateToProps => ({
	battleConfig: Selector.getBattleConfig(state),
	characters: Selector.getCharacters(state),
	parties: Selector.getParties(state)
});

const onStart = (history: History) => (setup: IBattleConfig) => {
	// save game config
	store.dispatch(Actions.saveSetup(setup));
	goto(history, '/battle');
};

const ViewBattleSetupContainer: React.SFC<IStateToProps & RouteComponentProps<any>> = ({ battleConfig, characters, parties, history }) => (
	<Page heading="Battle setup">
		<BattleSetup
			config={battleConfig}
			characters={characters}
			parties={parties}
			onBack={gotoFn(history, '/')}
			onStart={onStart(history)}
		/>
	</Page>
);

export default withRouter(
	connect(mapStateToProps)(ViewBattleSetupContainer)
);
