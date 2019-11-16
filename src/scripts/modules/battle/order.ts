import { maxOrderSize, characterCTLimit } from 'data/game-config';

import Character from 'modules/character';
import Player from 'modules/battle/player';

export interface IOrderCharacter {
	readonly order: number;
	readonly id: string;
	readonly name: string;
	readonly dead: boolean;
	readonly dying: boolean;
	readonly player: number;
}

export interface IOrderSnapshot {
	readonly characters: IOrderCharacter[];
}

class Order {
	private players: Player[] = [];
	private characters: Character[] = [];
	private order: Character[] = [];

	constructor(characters: Character[], players: Player[]) {
		this.characters = characters;
		this.players = players;
		this.update();
	}

	public get(): Character[] {
		return [...this.order];
	}

	public serialize(): IOrderSnapshot {
		return {
			characters: this.order.map((char, i) => {
				const state: IOrderCharacter = {
					order: i,
					id: char.battleId,
					name: char.name,
					dead: char.isDead(),
					dying: char.status.has('DYING'),
					player: char.player.id
				};
				return state;
			})
		};
	}

	public update(): void {
		const { players, characters } = this;
		const liveChars = characters.filter(char => !char.isDead());

		if (liveChars.length < 2) {
			this.order = liveChars;
			return;
		}
		const order: Character[] = [];

		// serialize characters
		const chars = liveChars.map(char => {
			const { SPD, CT } = char.attributes;
			const plOrder = players.indexOf(char.player);
			return { CT, SPD, playerOrder: plOrder, char };
		});

		main: while (order.length < maxOrderSize) {
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
			for (const item of act) {
				if (item.char === order[0]) {
					// prevent order repeating itself
					break main;
				}
				order.push(item.char);
			}
		}

		this.order = order;
	}
}

export default Order;
