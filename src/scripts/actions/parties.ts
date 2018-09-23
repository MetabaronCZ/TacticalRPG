import { createAction } from 'redux-actions';
import { PartyData } from 'engine/party-data';

export enum ActionID {
	ADD = 'PARTY_ADD',
	EDIT = 'PARTY_EDIT',
	REMOVE = 'PARTY_REMOVE',
	MOVE_DOWN_LIST = 'PARTY_MOVE_DOWN_LIST',
	MOVE_UP_LIST = 'PARTY_MOVE_UP_LIST'
}

export default {
	addParty: createAction(ActionID.ADD, (party: PartyData) => party),
	editParty: createAction(ActionID.EDIT, (party: PartyData) => party),
	removeParty: createAction(ActionID.REMOVE, (party: PartyData) => party),
	moveDownList: createAction(ActionID.MOVE_DOWN_LIST, (party: PartyData) => party),
	moveUpList: createAction(ActionID.MOVE_UP_LIST, (party: PartyData) => party)
};
