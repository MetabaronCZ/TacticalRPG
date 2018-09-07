import { maxOrderSize, characterCTLimit } from 'data/game-config';

import Player from 'engine/player';
import Character from 'engine/character';

class Order {
	private players: Player[] = [];
	private characters: Character[] = [];

	constructor(players: Player[]) {
		this.players = players;

		this.characters = players
			.map(pl => pl.getCharacters()) // get player characters
			.reduce((a, b) => a.concat(b)) // merge all characters
			.filter(char => !char.isDead()); // filter out dead characters

		this.update();
	}

	public get(): Character[] {
		return this.characters;
	}

	public update() {
		const { players, characters } = this;

		if (characters.length < 2) {
			return;
		}
		let order: Character[] = [];

		// serialize characters
		const chars = characters.map(character => {
			const SPD = character.getAttribute('SPD');
			const CT = character.getAttribute('CT');
			const id = character.getData().id;
			let playerOrder = -1;

			for (let p = 0, pmax = players.length; p < pmax; p++) {
				if (-1 !== players[p].getCharacters().indexOf(character)) {
					playerOrder = p;
					break;
				}
			}
			return { id, CT, SPD, playerOrder, character };
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

			// sort by character player initiative (+ sign converts boolean to number)
			act = act.sort((a, b) => {
				return b.playerOrder - a.playerOrder;
			});

			// sort by SPD
			act = act.sort((a, b) => b.SPD - a.SPD);

			// sort by CP
			act = act.sort((a, b) => b.CT - a.CT);

			// add acting characters to ordered array
			order = order.concat(act.map(a => a.character));
		}

		this.characters = order;
	}
}

export default Order;
