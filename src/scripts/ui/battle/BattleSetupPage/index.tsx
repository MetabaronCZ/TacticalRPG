import React from 'react';
import { History } from 'history';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

import { store } from 'index';
import { IStore } from 'store';
import * as Selector from 'selectors';
import { goto, gotoFn } from 'utils/nav';
import Actions from 'actions/battle-config';

import { PartyData } from 'engine/party-data';
import { IBattleConfig } from 'engine/battle-config';
import { CharacterData } from 'engine/character-data';

import Page from 'ui/common/Page';
import BattleSetup from 'ui/battle/BattleSetup';

interface IStateToProps {
	readonly battleConfig: IBattleConfig;
	readonly characters: CharacterData[];
	readonly parties: PartyData[];
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

const BattleSetupPageContainer: React.SFC<IStateToProps & RouteComponentProps<any>> = ({ battleConfig, characters, parties, history }) => (
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
	connect(mapStateToProps)(BattleSetupPageContainer)
);
