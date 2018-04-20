import { handleActions } from 'redux-actions';

import { ActionID } from 'actions/characters';
import * as Indexable from 'models/indexable';
import { ICharacterData } from 'models/character-data';

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
