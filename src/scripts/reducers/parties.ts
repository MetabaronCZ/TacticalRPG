import { handleActions } from 'redux-actions';

import { ActionID as PartyActionID } from 'actions/parties';
import { ActionID as CharacterActionID } from 'actions/characters';

import { IPartyData } from 'engine/party-data';
import { removeCharacter } from 'engine/utils/party';
import { CharacterData } from 'engine/character-data';
import { add, edit, remove, swap } from 'engine/utils/indexable';

const defaultState: IPartyData[] = [];

export default handleActions<IPartyData[], IPartyData & CharacterData>(
	{
		[PartyActionID.ADD]: (state, { payload }) => add(state, payload),
		[PartyActionID.EDIT]: (state, { payload }) => edit(state, payload),
		[PartyActionID.REMOVE]: (state, { payload }) => remove(state, payload),
		[PartyActionID.MOVE_DOWN_LIST]: (state, { payload }) => swap(state, +1, payload),
		[PartyActionID.MOVE_UP_LIST]: (state, { payload }) => swap(state, -1, payload),
		[CharacterActionID.REMOVE]: (state, { payload }) => removeCharacter(state, payload)
	},
	defaultState
);
