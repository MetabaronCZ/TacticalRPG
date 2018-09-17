import { handleActions } from 'redux-actions';

import { ActionID } from 'actions/characters';

import { IndexableUtils } from 'engine/indexable';
import { ICharacterData } from 'engine/character-data';

const defaultState: ICharacterData[] = [];

export default handleActions<ICharacterData[], ICharacterData>(
	{
		[ActionID.ADD]: (state, { payload }) => IndexableUtils.add(state, payload),
		[ActionID.EDIT]: (state, { payload }) => IndexableUtils.edit(state, payload),
		[ActionID.REMOVE]: (state, { payload }) => IndexableUtils.remove(state, payload),
		[ActionID.MOVE_DOWN_LIST]: (state, { payload }) => IndexableUtils.swap(state, +1, payload),
		[ActionID.MOVE_UP_LIST]: (state, { payload }) => IndexableUtils.swap(state, -1, payload)
	},
	defaultState
);
