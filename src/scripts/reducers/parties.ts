import { handleActions } from 'redux-actions';

import { ActionID as PartyActionID } from 'actions/parties';
import { ActionID as CharacterActionID } from 'actions/characters';
import { remove, swap, edit, add } from 'reducers/indexable';

import { PartyData } from 'engine/party-data';
import { CharacterData } from 'engine/character-data';

const defaultState: PartyData[] = [];

export default handleActions<PartyData[], PartyData & CharacterData>(
	{
		[PartyActionID.ADD]: (state, { payload }) => add(state, payload),
		[PartyActionID.EDIT]: (state, { payload }) => edit(state, payload),
		[PartyActionID.REMOVE]: (state, { payload }) => remove(state, payload),
		[PartyActionID.MOVE_DOWN_LIST]: (state, { payload }) => swap(state, +1, payload),
		[PartyActionID.MOVE_UP_LIST]: (state, { payload }) => swap(state, -1, payload),
		[CharacterActionID.REMOVE]: (state, { payload }) => {
			return state.map(party => {
				if (payload) {
					party.removeCharacter(payload.id);
				}
				return party;
			});
		}
	},
	defaultState
);
