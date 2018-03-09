import { IAction } from 'store';
import { IParty } from 'models/party';

export enum ActionID {
	ADD = 'PARTY_ADD',
	EDIT = 'PARTY_EDIT',
	REMOVE = 'PARTY_REMOVE',
	MOVE_DOWN_LIST = 'PARTY_MOVE_DOWN_LIST',
	MOVE_UP_LIST = 'PARTY_MOVE_UP_LIST'
}

const addParty = (value: IParty): IAction => ({
	type: ActionID.ADD,
	value
});

const editParty = (value: IParty): IAction => ({
	type: ActionID.EDIT,
	value
});

const removeParty = (id: string): IAction => ({
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
	addParty,
	editParty,
	removeParty,
	moveDownList,
	moveUpList
};
