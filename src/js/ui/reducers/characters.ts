import { ActionID, ICharacterAction } from 'ui/actions/characters';
import { add, edit, remove, swap } from 'utils/array';
import { IState } from 'ui/store';
import { ICharacter } from 'models/character';

// characters reducer
const characters = (state = [], action: ICharacterAction) => {
	switch (action.type) {
		case ActionID.ADD:
			return add(action.value, state);

		case ActionID.EDIT:
			return edit(action.value, state);

		case ActionID.REMOVE:
			return remove(action.id, state);

		case ActionID.MOVE_DOWN_LIST:
			return swap(action.id, +1, state);

		case ActionID.MOVE_UP_LIST:
			return swap(action.id, -1, state);
	}
	return state;
};

export default characters;
