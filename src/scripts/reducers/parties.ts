import { handleActions } from 'redux-actions';

import { ActionID as PartyActionID } from 'actions/parties';
import { ActionID as CharacterActionID } from 'actions/characters';

import { IndexableUtils } from 'engine/indexable';
import { ICharacterData } from 'engine/character-data';
import PartyDataUtils, { IPartyData } from 'engine/party-data';

const defaultState: IPartyData[] = [];

export default handleActions<IPartyData[], IPartyData & ICharacterData>(
	{
		[PartyActionID.ADD]: (state, { payload }) => IndexableUtils.add(state, payload),
		[PartyActionID.EDIT]: (state, { payload }) => IndexableUtils.edit(state, payload),
		[PartyActionID.REMOVE]: (state, { payload }) => IndexableUtils.remove(state, payload),
		[PartyActionID.MOVE_DOWN_LIST]: (state, { payload }) => IndexableUtils.swap(state, +1, payload),
		[PartyActionID.MOVE_UP_LIST]: (state, { payload }) => IndexableUtils.swap(state, -1, payload),
		[CharacterActionID.REMOVE]: (state, { payload }) => PartyDataUtils.removeCharacter(state, payload)
	},
	defaultState
);
