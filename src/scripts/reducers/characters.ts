import uuid from 'uuid/v1';
import { handleActions } from 'redux-actions';

import { ActionID } from 'actions/characters';

import { CharacterData } from 'engine/character-data';
import { remove, swap } from 'engine/utils/indexable';

const defaultState: CharacterData[] = [];

export default handleActions<CharacterData[], CharacterData>(
	{
		[ActionID.ADD]: (state, { payload }) => {
			if (!payload) {
				return state;
			}
			const now = Date.now();

			const data = Object.assign({}, payload, {
				id: uuid(),
				creationDate: now,
				lastUpdate: now
			});

			return state.concat(new CharacterData(data));
		},
		[ActionID.EDIT]: (state, { payload }) => {
			if (!payload) {
				return state;
			}
			const now = Date.now();

			return state.map(item => {
				if (payload.id === item.id) {
					const data = Object.assign({}, item, payload, { lastUpdate: now });
					return new CharacterData(data);
				}
				return item;
			});
		},
		[ActionID.REMOVE]: (state, { payload }) => remove(state, payload),
		[ActionID.MOVE_DOWN_LIST]: (state, { payload }) => swap(state, +1, payload),
		[ActionID.MOVE_UP_LIST]: (state, { payload }) => swap(state, -1, payload)
	},
	defaultState
);
