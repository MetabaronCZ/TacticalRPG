import { IAction } from 'store';
import { ICharacter } from 'models/character';
import { Attributes } from 'models/attributes';
import { ActionID } from 'actions/game/characters';

const characters = (state: ICharacter[] = [], action: IAction): ICharacter[] => {
	switch (action.type) {
		case ActionID.ADD_CHARACTER:
			return state.concat({
				data: action.character,
				position: action.position,
				player: action.player,
				baseAttributes: Attributes.create(action.character.primary, action.character.secondary),
				currAttributes: Attributes.create(action.character.primary, action.character.secondary)
			});
	}
	return state;
};

export default characters;
