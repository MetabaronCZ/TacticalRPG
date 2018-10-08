import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { Store } from 'store';
import { goto, gotoFn } from 'core/navigation';
import { withContext, IContext } from 'context';

import { BattleConfig } from 'engine/battle-config';

import Page from 'ui/common/Page';
import BattleConfigUI from 'ui/battle-management/BattleConfigUI';

const onStart = (history: History, store: Store) => (config: BattleConfig) => {
	store.battleConfig.update(config.serialize());
	store.save();

	goto(history, '/battle');
};

const BattleConfigPageContainer: React.SFC<RouteComponentProps<any> & IContext> = ({ history, store }) => (
	<Page heading="Battle config">
		<BattleConfigUI
			config={store.battleConfig}
			characters={store.characters.data}
			parties={store.parties.data}
			onBack={gotoFn(history, '/')}
			onStart={onStart(history, store)}
		/>
	</Page>
);

export default withRouter(
	withContext(BattleConfigPageContainer)
);
