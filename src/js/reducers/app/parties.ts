import { ActionID as CharacterActionID } from 'actions/app/characters';
import { ActionID as PartyActionID } from 'actions/app/parties';
import { add, edit, remove, swap } from 'utils/array';
import { IParty } from 'models/party';
import { IAction } from 'store';

const removeCharacter = (id: string, state: IParty[]): IParty[] => {
	if (!id || !state.length) {
		return state;
	}
	const newState: IParty[] = [];

	for (const party of state) {
		const newChars = party.characters.filter((charId) => charId !== id);

		if (newChars.length) {
			newState.push({
				...party,
				characters: newChars
			});
		}
	}
	return newState;
};

// parties reducer
const parties = (state: IParty[] = [], action: IAction): IParty[] => {
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
