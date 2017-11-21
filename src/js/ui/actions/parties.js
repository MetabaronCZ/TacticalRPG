export const ADD = 'PARTY_ADD';
export const EDIT = 'PARTY_EDIT';
export const REMOVE = 'PARTY_REMOVE';
export const MOVE_DOWN_LIST = 'PARTY_MOVE_DOWN_LIST';
export const MOVE_UP_LIST = 'PARTY_MOVE_UP_LIST';

const addParty = value => ({
	type: ADD,
	value
});

const editParty = value => ({
	type: EDIT,
	value
});

const removeParty = id => ({
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
	addParty,
	editParty,
	removeParty,
	moveDownList,
	moveUpList
};
