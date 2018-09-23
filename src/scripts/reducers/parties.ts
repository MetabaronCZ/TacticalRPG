import { handleActions } from 'redux-actions';

import { ActionID as PartyActionID } from 'actions/parties';
import { remove, swap, edit, add } from 'reducers/indexable';

import { PartyData } from 'engine/party-data';

const defaultState: PartyData[] = [];

export default handleActions<PartyData[], PartyData>(
	{
		[PartyActionID.ADD]: (state, { payload }) => add(state, payload),
		[PartyActionID.EDIT]: (state, { payload }) => edit(state, payload),
		[PartyActionID.REMOVE]: (state, { payload }) => remove(state, payload),
		[PartyActionID.MOVE_DOWN_LIST]: (state, { payload }) => swap(state, +1, payload),
		[PartyActionID.MOVE_UP_LIST]: (state, { payload }) => swap(state, -1, payload),
	},
	defaultState
);
