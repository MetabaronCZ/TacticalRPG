import { handleActions } from 'redux-actions';

import { ActionID } from 'actions/characters';

import { ICharacterData } from 'engine/character-data';
import { add, edit, remove, swap } from 'engine/utils/indexable';

const defaultState: ICharacterData[] = [];

export default handleActions<ICharacterData[], ICharacterData>(
	{
		[ActionID.ADD]: (state, { payload }) => add(state, payload),
		[ActionID.EDIT]: (state, { payload }) => edit(state, payload),
		[ActionID.REMOVE]: (state, { payload }) => remove(state, payload),
		[ActionID.MOVE_DOWN_LIST]: (state, { payload }) => swap(state, +1, payload),
		[ActionID.MOVE_UP_LIST]: (state, { payload }) => swap(state, -1, payload)
	},
	defaultState
);
