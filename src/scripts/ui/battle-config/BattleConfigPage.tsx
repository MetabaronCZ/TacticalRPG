import React from 'react';
import { History } from 'history';
import { useHistory } from 'react-router';

import { withContext, IContext } from 'context';
import { gotoRoute, gotoFn } from 'core/navigation';

import { Store } from 'modules/store';
import { BattleConfig } from 'modules/battle-configuration/battle-config';

import Page from 'ui/common/Page';
import BattleConfigUI from 'ui/battle-config/BattleConfigUI';

const onStart = (history: History, store: Store) => (config: BattleConfig) => {
	store.battleConfig.update(config.serialize());
	store.save();

	gotoRoute(history, 'BATTLE');
};

const BattleConfigPageContainer: React.SFC<IContext> = ({ store }) => {
	const history = useHistory();
	return (
		<Page heading="Battle config">
			<BattleConfigUI
				config={store.battleConfig}
				characters={store.characters.data}
				parties={store.parties.data}
				onBack={gotoFn(history, 'ROOT')}
				onStart={onStart(history, store)}
			/>
		</Page>
	);
};

export default withContext(BattleConfigPageContainer);
