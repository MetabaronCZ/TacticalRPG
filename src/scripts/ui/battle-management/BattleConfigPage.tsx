import React from 'react';
import { History } from 'history';
import { withRouter, RouteComponentProps } from 'react-router';

import { withContext, IContext } from 'context';
import { gotoRoute, gotoFn } from 'core/navigation';

import { Store } from 'modules/store';
import { IRouteParams } from 'modules/route';
import { BattleConfig } from 'modules/battle-configuration/battle-config';

import Page from 'ui/common/Page';
import BattleConfigUI from 'ui/battle-management/BattleConfigUI';

const onStart = (history: History, store: Store) => (config: BattleConfig) => {
	store.battleConfig.update(config.serialize());
	store.save();

	gotoRoute(history, 'BATTLE');
};

const BattleConfigPageContainer: React.SFC<RouteComponentProps<IRouteParams> & IContext> = ({ history, store }) => {
	const characters = store.characters.data.map(char => char.serialize());
	return (
		<Page heading="Battle config">
			<BattleConfigUI
				config={store.battleConfig}
				characters={characters}
				parties={store.parties.data}
				onBack={gotoFn(history, 'ROOT')}
				onStart={onStart(history, store)}
			/>
		</Page>
	);
};

export default withRouter(
	withContext(BattleConfigPageContainer)
);
