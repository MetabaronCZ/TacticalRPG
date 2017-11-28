import { IParty } from 'models/party';

export enum ActionID {
	ADD = 'PARTY_ADD',
	EDIT = 'PARTY_EDIT',
	REMOVE = 'PARTY_REMOVE',
	MOVE_DOWN_LIST = 'PARTY_MOVE_DOWN_LIST',
	MOVE_UP_LIST = 'PARTY_MOVE_UP_LIST'
}

export interface IPartyAction {
	type: ActionID;
	[data: string]: any;
}

const addParty = (value: IParty): IPartyAction => ({
	type: ActionID.ADD,
	value
});

const editParty = (value: IParty): IPartyAction => ({
	type: ActionID.EDIT,
	value
});

const removeParty = (id: string): IPartyAction => ({
	type: ActionID.REMOVE,
	id
});

const moveDownList = (id: string): IPartyAction => ({
	type: ActionID.MOVE_DOWN_LIST,
	id
});

const moveUpList = (id: string): IPartyAction => ({
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
