import { IAction } from 'store';
import * as Indexable from 'models/indexable';
import { IParty, Party } from 'models/party';
import { ActionID as PartyActionID } from 'actions/parties';
import { ActionID as CharacterActionID } from 'actions/characters';

// parties reducer
const parties = (state: IParty[] = [], action: IAction): IParty[] => {
	switch (action.type) {
		case PartyActionID.ADD:
			return Indexable.add(action.value, state);

		case PartyActionID.EDIT:
			return Indexable.edit(action.value, state);

		case PartyActionID.REMOVE:
			return Indexable.remove(action.id, state);

		case PartyActionID.MOVE_DOWN_LIST:
			return Indexable.swap(action.id, +1, state);

		case PartyActionID.MOVE_UP_LIST:
			return Indexable.swap(action.id, -1, state);

		case CharacterActionID.REMOVE:
			return Party.removeCharacter(action.id, state);
	}
	return state;
};

export default parties;
