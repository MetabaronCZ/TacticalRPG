import { ICharacterData } from 'models/character';
import { IAction } from 'store';

export enum ActionID {
	ADD = 'CHARACTER_ADD',
	EDIT = 'CHARACTER_EDIT',
	REMOVE = 'CHARACTER_REMOVE',
	MOVE_DOWN_LIST = 'CHARACTER_MOVE_DOWN_LIST',
	MOVE_UP_LIST = 'CHARACTER_MOVE_UP_LIST'
}

const addCharacter = (value: ICharacterData): IAction => ({
	type: ActionID.ADD,
	value
});

const editCharacter = (value: ICharacterData): IAction => ({
	type: ActionID.EDIT,
	value
});

const removeCharacter = (id: string): IAction => ({
	type: ActionID.REMOVE,
	id
});

const moveDownList = (id: string): IAction => ({
	type: ActionID.MOVE_DOWN_LIST,
	id
});

const moveUpList = (id: string): IAction => ({
	type: ActionID.MOVE_UP_LIST,
	id
});

export default {
	addCharacter,
	editCharacter,
	removeCharacter,
	moveDownList,
	moveUpList
};
