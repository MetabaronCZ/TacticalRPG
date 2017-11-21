export const ADD = 'CHARACTER_ADD';
export const EDIT = 'CHARACTER_EDIT';
export const REMOVE = 'CHARACTER_REMOVE';
export const MOVE_DOWN_LIST = 'CHARACTER_MOVE_DOWN_LIST';
export const MOVE_UP_LIST = 'CHARACTER_MOVE_UP_LIST';

const addCharacter = value => ({
	type: ADD,
	value
});

const editCharacter = value => ({
	type: EDIT,
	value
});

const removeCharacter = id => ({
	type: REMOVE,
	id
});

const moveDownList = id => ({
	type: MOVE_DOWN_LIST,
	id
});

const moveUpList = id => ({
	type: MOVE_UP_LIST,
	id
});

export default {
	addCharacter,
	editCharacter,
	removeCharacter,
	moveDownList,
	moveUpList
};
