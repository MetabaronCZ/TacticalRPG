import { PlayerType } from 'models/player';
import { ICharacter, Character } from 'models/character';

export type IOrder = string[];

export class Order {
	public static maxCapacity = 20;

	public static make(characters: ICharacter[], initiative: PlayerType): IOrder {
		let order: IOrder = [];

		// serialize characters
		const chars = characters.map((char) => ({
			id: char.data.id,
			initiative: (char.player === initiative),
			CP: char.currAttributes.CP,
			SPD: char.currAttributes.SPD
		}));

		while (order.length < this.maxCapacity) {
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
			order = order.concat(act.map((char) => char.id));
		}

		return order;
	}
}
