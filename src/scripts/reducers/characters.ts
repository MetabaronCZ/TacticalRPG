import { handleActions } from 'redux-actions';

import Indexable from 'engine/indexable';

import { ActionID } from 'actions/characters';
import { ICharacterData } from 'modules/character-data/types';

const defaultState: ICharacterData[] = [];

export default handleActions<ICharacterData[], ICharacterData>(
	{
		[ActionID.ADD]: (state, { payload }) => Indexable.add(state, payload),
		[ActionID.EDIT]: (state, { payload }) => Indexable.edit(state, payload),
		[ActionID.REMOVE]: (state, { payload }) => Indexable.remove(state, payload),
		[ActionID.MOVE_DOWN_LIST]: (state, { payload }) => Indexable.swap(state, +1, payload),
		[ActionID.MOVE_UP_LIST]: (state, { payload }) => Indexable.swap(state, -1, payload)
	},
	defaultState
);
