import { IAction } from 'store';
import { PlayerType } from 'models/player';

export enum ActionID {
	ORDER_UPDATE = 'ORDER_UPDATE',
}

const update = (initiative: PlayerType): IAction => ({
	type: ActionID.ORDER_UPDATE,
	initiative
});

export default {
	update
};
