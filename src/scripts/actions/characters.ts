import { createAction } from 'redux-actions';
import { ICharacterData } from 'engine/character-data';

export enum ActionID {
	ADD = 'CHARACTER_ADD',
	EDIT = 'CHARACTER_EDIT',
	REMOVE = 'CHARACTER_REMOVE',
	MOVE_DOWN_LIST = 'CHARACTER_MOVE_DOWN_LIST',
	MOVE_UP_LIST = 'CHARACTER_MOVE_UP_LIST'
}

export default {
	addCharacter: createAction(ActionID.ADD, (char: ICharacterData) => char),
	editCharacter: createAction(ActionID.EDIT, (char: ICharacterData) => char),
	removeCharacter: createAction(ActionID.REMOVE, (char: ICharacterData) => char),
	moveDownList: createAction(ActionID.MOVE_DOWN_LIST, (char: ICharacterData) => char),
	moveUpList: createAction(ActionID.MOVE_UP_LIST, (char: ICharacterData) => char)
};
