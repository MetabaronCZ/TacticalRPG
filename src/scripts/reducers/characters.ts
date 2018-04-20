import { IAction } from 'store';
import { ActionID } from 'actions/characters';
import * as Indexable from 'models/indexable';
import { ICharacterData } from 'models/character-data';

// characters reducer
const characters = (state: ICharacterData[] = [], action: IAction): ICharacterData[] => {
	switch (action.type) {
		case ActionID.ADD:
			return Indexable.add(action.value, state);

		case ActionID.EDIT:
			return Indexable.edit(action.value, state);

		case ActionID.REMOVE:
			return Indexable.remove(action.id, state);

		case ActionID.MOVE_DOWN_LIST:
			return Indexable.swap(action.id, +1, state);

		case ActionID.MOVE_UP_LIST:
			return Indexable.swap(action.id, -1, state);
	}
	return state;
};

export default characters;
