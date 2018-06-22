import { maxOrderSize, characterCTLimit } from 'data/game-config';

import { PlayerType } from 'modules/player';
import { ICharacter } from 'modules/character';

export type IOrder = string[];

const getDefault = (): IOrder => {
	return [];
};

const get = (characters: ICharacter[], initiative: PlayerType): IOrder => {
	if (0 === characters.length || !initiative) {
		return [];
	}

	if (1 === characters.length) {
		return [characters[0].data.id];
	}
	let o: IOrder = [];

	// serialize characters
	const chars = characters.map(char => ({
		id: char.data.id,
		initiative: (char.player === initiative),
		CT: char.currAttributes.CT,
		SPD: char.currAttributes.SPD
	}));

	while (o.length < maxOrderSize) {
		let act = [];

		// get characters who can act
		for (const char of chars) {
			if (char.CT >= characterCTLimit) {
				act.push(char);
				char.CT %= characterCTLimit;
			}
			char.CT += char.SPD;
		}

		// sort by character player initiative (+ sign converts boolean to number)
		act = act.sort((a, b) => {
			return (+b.initiative) - (+a.initiative);
		});

		// sort by SPD
		act = act.sort((a, b) => b.SPD - a.SPD);

		// sort by CP
		act = act.sort((a, b) => b.CT - a.CT);

		// add acting characters to ordered array
		o = o.concat(act.map(char => char.id));
	}

	return o;
};

export const Order = {
	getDefault,
	get
};
