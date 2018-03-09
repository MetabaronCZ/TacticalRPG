import { IAction } from 'store';
import { ActionID } from 'actions/game/characters';
import { ICharacter, Character } from 'models/character';

const characters = (state: ICharacter[] = [], action: IAction): ICharacter[] => {
	switch (action.type) {
		case ActionID.ADD_CHARACTER:
			return [...state, Character.create(action.character, action.position, action.player)];
	}
	return state;
};

export default characters;
