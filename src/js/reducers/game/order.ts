import { store } from 'app';
import { IAction } from 'store';
import { ActionID } from 'actions/game/order';

import { PlayerType } from 'models/player';
import { IOrder, Order } from 'models/order';
import { ICharacter, Character } from 'models/character';

// create new order
const getOrder = (characters: ICharacter[], initiative: PlayerType): IOrder => {
	if (0 === characters.length) {
		return [];
	}

	if (1 === characters.length) {
		return [characters[0].data.id];
	}
	let o: IOrder = [];

	// serialize characters
	const chars = characters.map((char) => ({
		id: char.data.id,
		initiative: (char.player === initiative),
		CP: char.currAttributes.CP,
		SPD: char.currAttributes.SPD
	}));

	while (o.length < Order.maxCapacity) {
		let act = [];

		// get characters who can act
		for (const char of chars) {
			if (char.CP >= Character.cpLimit) {
				act.push(char);
				char.CP %= Character.cpLimit;
			}
			char.CP += char.SPD;
		}

		// sort by character player initiative (+ sign converts boolean to number)
		act = act.sort((a, b) => {
			return (+b.initiative) - (+a.initiative);
		});

		// sort by SPD
		act = act.sort((a, b) => b.SPD - a.SPD);

		// add acting characters to ordered array
		o = o.concat(act.map((char) => char.id));
	}

	return o;
};

const order = (state: IOrder = [], action: IAction): IOrder => {
	switch (action.type) {
		case ActionID.ORDER_UPDATE:
			const characters = store.getState().game.characters;
			return getOrder(characters, action.initiative);
	}
	return state;
};

export default order;
