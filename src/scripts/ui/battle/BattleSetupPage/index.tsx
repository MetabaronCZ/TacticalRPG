import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { Store } from '_store';
import { withContext, IContext } from 'context';

import { goto, gotoFn } from 'utils/nav';
import { BattleConfig } from 'engine/battle-config';

import Page from 'ui/common/Page';
import BattleSetup from 'ui/battle/BattleSetup';

const onStart = (history: History, store: Store) => (config: BattleConfig) => {
	store.battleConfig.update(config.serialize());
	store.save();

	goto(history, '/battle');
};

const BattleSetupPageContainer: React.SFC<RouteComponentProps<any> & IContext> = ({ history, store }) => (
	<Page heading="Battle setup">
		<BattleSetup
			config={store.battleConfig}
			characters={store.characters}
			parties={store.parties}
			onBack={gotoFn(history, '/')}
			onStart={onStart(history, store)}
		/>
	</Page>
);

export default withRouter(
	withContext(BattleSetupPageContainer)
);
