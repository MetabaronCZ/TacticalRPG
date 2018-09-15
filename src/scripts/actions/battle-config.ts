import { createAction } from 'redux-actions';
import { IBattleConfig } from 'engine/battle-config';

export enum ActionID {
	SAVE_SETUP = 'BATTLE_SAVE_SETUP',
}

export default {
	saveSetup: createAction(ActionID.SAVE_SETUP, (setup: IBattleConfig) => setup)
};
