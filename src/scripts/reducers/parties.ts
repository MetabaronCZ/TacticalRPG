import { handleActions } from 'redux-actions';

import { ActionID as PartyActionID } from 'actions/parties';
import { ActionID as CharacterActionID } from 'actions/characters';

import { IParty, Party } from 'modules/party';
import * as Indexable from 'modules/indexable';
import { ICharacterData } from 'modules/character-data';

const defaultState: IParty[] = [];

export default handleActions<IParty[], IParty & ICharacterData>(
	{
		[PartyActionID.ADD]: (state, { payload }) => Indexable.add(state, payload),
		[PartyActionID.EDIT]: (state, { payload }) => Indexable.edit(state, payload),
		[PartyActionID.REMOVE]: (state, { payload }) => Indexable.remove(state, payload),
		[PartyActionID.MOVE_DOWN_LIST]: (state, { payload }) => Indexable.swap(state, +1, payload),
		[PartyActionID.MOVE_UP_LIST]: (state, { payload }) => Indexable.swap(state, -1, payload),
		[CharacterActionID.REMOVE]: (state, { payload }) => Party.removeCharacter(state, payload)
	},
	defaultState
);
