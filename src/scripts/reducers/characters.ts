import { IAction } from 'store';
import * as Array from 'utils/array';
import { ActionID } from 'actions/characters';
import { ICharacterData } from 'models/character-data';

// characters reducer
const characters = (state: ICharacterData[] = [], action: IAction): ICharacterData[] => {
	switch (action.type) {
		case ActionID.ADD:
			return Array.add(action.value, state);

		case ActionID.EDIT:
			return Array.edit(action.value, state);

		case ActionID.REMOVE:
			return Array.remove(action.id, state);

		case ActionID.MOVE_DOWN_LIST:
			return Array.swap(action.id, +1, state);

		case ActionID.MOVE_UP_LIST:
			return Array.swap(action.id, -1, state);
	}
	return state;
};

export default characters;
