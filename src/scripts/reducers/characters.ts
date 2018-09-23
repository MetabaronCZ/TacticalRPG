import { handleActions } from 'redux-actions';

import { ActionID } from 'actions/characters';
import { remove, swap, edit, add } from 'reducers/indexable';

import { CharacterData } from 'engine/character-data';

const defaultState: CharacterData[] = [];

export default handleActions<CharacterData[], CharacterData>(
	{
		[ActionID.ADD]: (state, { payload }) => add(state, payload),
		[ActionID.EDIT]: (state, { payload }) => edit(state, payload),
		[ActionID.REMOVE]: (state, { payload }) => remove(state, payload),
		[ActionID.MOVE_DOWN_LIST]: (state, { payload }) => swap(state, +1, payload),
		[ActionID.MOVE_UP_LIST]: (state, { payload }) => swap(state, -1, payload)
	},
	defaultState
);
