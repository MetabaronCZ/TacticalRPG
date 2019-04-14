import { maxOrderSize, characterCTLimit } from 'data/game-config';

import AIPlayer from 'modules/ai/player';
import Character from 'modules/character';
import Player from 'modules/battle/player';

class Order {
	private players: Array<Player|AIPlayer> = [];
	private characters: Character[] = [];
	private order: Character[] = [];

	constructor(players: Array<Player|AIPlayer>) {
		this.characters = players.map(pl => pl.getCharacters()).reduce((a, b) => a.concat(b));
		this.players = players;
		this.update();
	}

	public serialize(): Character[] {
		return this.order;
	}

	public update() {
		const { players, characters } = this;
		const liveChars = characters.filter(char => !char.isDead());

		if (liveChars.length < 2) {
			this.order = liveChars;
			return;
		}
		let order: Character[] = [];

		// serialize characters
		const chars = liveChars.map(char => {
			const { SPD, CT } = char.attributes;
			let playerOrder = -1;

			for (let p = 0, pmax = players.length; p < pmax; p++) {
				if (-1 !== players[p].getCharacters().indexOf(char)) {
					playerOrder = p;
					break;
				}
			}
			return { CT, SPD, playerOrder, char };
		});

		while (order.length < maxOrderSize) {
			let act = [];

			// get characters who can act
			for (const char of chars) {
				if (char.CT >= characterCTLimit) {
					act.push(char);
					char.CT %= characterCTLimit;
				}
				char.CT += char.SPD;
			}

			if (!act.length) {
				continue;
			}

			// sort by character player initiative (+ sign converts boolean to number)
			act = act.sort((a, b) => b.playerOrder - a.playerOrder);

			// sort by SPD
			act = act.sort((a, b) => b.SPD - a.SPD);

			// sort by CP
			act = act.sort((a, b) => b.CT - a.CT);

			// add acting characters to ordered array
			order = [...order, ...act.map(a => a.char)];
		}

		this.order = order;
	}
}

export default Order;
