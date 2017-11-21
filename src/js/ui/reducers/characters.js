import { ADD, EDIT, REMOVE, MOVE_DOWN_LIST, MOVE_UP_LIST } from 'ui/actions/characters';
import { add, edit, remove, swap } from 'utils/array';

// characters reducer
const characters = (state = [], action) => {
	switch( action.type ){
		case ADD:
			return add(action.value, state);

		case EDIT:
			return edit(action.value, state);

		case REMOVE:
			return remove(action.id, state);

		case MOVE_DOWN_LIST:
			return swap(action.id, +1, state);

		case MOVE_UP_LIST:
			return swap(action.id, -1, state);
	}
	return state;
};

export default characters;
