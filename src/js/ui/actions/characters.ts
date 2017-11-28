import { ICharacter } from 'models/character';

export enum ActionID {
	ADD = 'CHARACTER_ADD',
	EDIT = 'CHARACTER_EDIT',
	REMOVE = 'CHARACTER_REMOVE',
	MOVE_DOWN_LIST = 'CHARACTER_MOVE_DOWN_LIST',
	MOVE_UP_LIST = 'CHARACTER_MOVE_UP_LIST'
}

export interface ICharacterAction {
	type: ActionID;
	[data: string]: any;
}

const addCharacter = (value: ICharacter): ICharacterAction => ({
	type: ActionID.ADD,
	value
});

const editCharacter = (value: ICharacter): ICharacterAction => ({
	type: ActionID.EDIT,
	value
});

const removeCharacter = (id: string): ICharacterAction => ({
	type: ActionID.REMOVE,
	id
});

const moveDownList = (id: string): ICharacterAction => ({
	type: ActionID.MOVE_DOWN_LIST,
	id
});

const moveUpList = (id: string): ICharacterAction => ({
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
