import { ActionID as CharacterActionID } from 'actions/characters';
import { add, edit, remove, swap } from 'utils/array';
import { IAction } from 'store';

// characters reducer
const characters = (state = [], action: IAction) => {
	switch (action.type) {
		case CharacterActionID.ADD:
			return add(action.value, state);

		case CharacterActionID.EDIT:
			return edit(action.value, state);

		case CharacterActionID.REMOVE:
			return remove(action.id, state);

		case CharacterActionID.MOVE_DOWN_LIST:
			return swap(action.id, +1, state);

		case CharacterActionID.MOVE_UP_LIST:
			return swap(action.id, -1, state);
	}
	return state;
};

export default characters;
