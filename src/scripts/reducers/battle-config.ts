import { handleActions } from 'redux-actions';

import { ActionID } from 'actions/battle-config';
import { IBattleConfig } from 'engine/battle-config';

const defaultState: IBattleConfig = {
	players: []
};

export default handleActions<IBattleConfig, IBattleConfig>(
	{
		[ActionID.SAVE_SETUP]: (state, { payload }) => payload || defaultState,
	},
	defaultState
);
