import { ICharacter, Character } from 'models/character';
import { PlayerType } from 'models/player';

export type IOrder = string[];

export class Order {
	// maximum size of ordered character array
	public static maxCapacity = 20;

	public static get(characters: ICharacter[], initiative: PlayerType): IOrder {
		if (0 === characters.length) {
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
			o = o.concat(act.map(char => char.id));
		}

		return o;
	}
}
