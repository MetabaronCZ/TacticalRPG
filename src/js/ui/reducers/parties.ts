import { ActionID as PartyActionID } from 'ui/actions/parties';
import { ActionID as CharacterActionID } from 'ui/actions/characters';
import { add, edit, remove, swap } from 'utils/array';
import { IAction, IState } from 'ui/store';
import { IParty } from 'models/party';

const removeCharacter = (id: string, state: IParty[]) => {
	if (!id) {
		return state;
	}
	return state.map((party: IParty) => {
		return {
			...party,
			characters: remove(id, party.characters)
		};
	});
};

// parties reducer
const parties = (state = [], action: IAction) => {
	switch (action.type) {
		case PartyActionID.ADD:
			return add(action.value, state);

		case PartyActionID.EDIT:
			return edit(action.value, state);

		case PartyActionID.REMOVE:
			return remove(action.id, state);

		case PartyActionID.MOVE_DOWN_LIST:
			return swap(action.id, +1, state);

		case PartyActionID.MOVE_UP_LIST:
			return swap(action.id, -1, state);

		case CharacterActionID.REMOVE:
			return removeCharacter(action.id, state);
	}
	return state;
};

export default parties;
