import { store } from 'index';
import { IAction } from 'store';
import { IOrder, Order } from 'models/order';
import { ActionID } from 'actions/game/order';

const order = (state: IOrder = [], action: IAction): IOrder => {
	switch (action.type) {
		case ActionID.ORDER_UPDATE:
			const characters = store.getState().game.characters;
			return Order.get(characters, action.initiative);
	}
	return state;
};

export default order;
