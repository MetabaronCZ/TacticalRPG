import { createAction } from 'redux-actions';
import { IPartyData } from 'engine/party-data';

export enum ActionID {
	ADD = 'PARTY_ADD',
	EDIT = 'PARTY_EDIT',
	REMOVE = 'PARTY_REMOVE',
	MOVE_DOWN_LIST = 'PARTY_MOVE_DOWN_LIST',
	MOVE_UP_LIST = 'PARTY_MOVE_UP_LIST'
}

export default {
	addParty: createAction(ActionID.ADD, (party: IPartyData) => party),
	editParty: createAction(ActionID.EDIT, (party: IPartyData) => party),
	removeParty: createAction(ActionID.REMOVE, (party: IPartyData) => party),
	moveDownList: createAction(ActionID.MOVE_DOWN_LIST, (party: IPartyData) => party),
	moveUpList: createAction(ActionID.MOVE_UP_LIST, (party: IPartyData) => party)
};
