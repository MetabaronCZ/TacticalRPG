import { createAction } from 'redux-actions';
import { IParty } from 'models/party';

export enum ActionID {
	ADD = 'PARTY_ADD',
	EDIT = 'PARTY_EDIT',
	REMOVE = 'PARTY_REMOVE',
	MOVE_DOWN_LIST = 'PARTY_MOVE_DOWN_LIST',
	MOVE_UP_LIST = 'PARTY_MOVE_UP_LIST'
}

export default {
	addParty: createAction(ActionID.ADD, (party: IParty) => party),
	editParty: createAction(ActionID.EDIT, (party: IParty) => party),
	removeParty: createAction(ActionID.REMOVE, (party: IParty) => party),
	moveDownList: createAction(ActionID.MOVE_DOWN_LIST, (party: IParty) => party),
	moveUpList: createAction(ActionID.MOVE_UP_LIST, (party: IParty) => party)
};
