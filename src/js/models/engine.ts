import { getRandomPartyCharacters, getCharacterById } from 'models/party/utils';

import Player from 'models/player';
import Position from 'models/position';
import { IPartyData } from 'models/party';
import { IAttributes } from 'models/attributes';
import { Character, ICharacterData } from 'models/character';
import { ICharacterConfig } from 'models/character/character';

const orderMaxLength = 20;
const cpLimit = 100;

export interface IEngineConfig {
	readonly party: IPartyData;
	readonly characters: ICharacterData[];
	readonly size: number;
}

interface IOrderItem extends IAttributes {
	readonly id: string;
	readonly player: Player;
}

export interface IEngineState {
	ally: Character[];
	enemy: Character[];
	order: Character[];
}

class Engine {
	private ally: Player;
	private enemy: Player;
	private order: Character[];
	private initiative: Player;

	constructor(conf: IEngineConfig) {
		const { party, size } = conf;
		const ally: ICharacterConfig[] = [];
		const enemy: ICharacterConfig[] = [];

		// filter out non-existent characters and assign party character positions
		party.characters.filter((id) => !!id)
			.forEach((id, i) => {
				const char = getCharacterById(id, conf.characters);
				const charConfig = {
					...char,
					position: new Position(i + 2, size - 1)
				};
				ally.push(charConfig);
			});

		this.ally = new Player(ally, false);

		// create random enemy party
		const enemyParty = getRandomPartyCharacters(party.characters.length);

		// assign enemy character positions
		enemyParty
			.forEach((char, i) => {
				const charConfig = {
					...char,
					position: new Position(i + 2, 0)
				};
				enemy.push(charConfig);
			});

		this.enemy = new Player(enemy, true);

		// which player is attacking
		this.initiative = Math.random() < 0.5 ? this.ally : this.enemy;

		// make initial character order
		this.order = this.makeOrder();
	}

	public getState(): IEngineState {
		return {
			ally: this.ally.getCharacters(),
			enemy: this.enemy.getCharacters(),
			order: this.order
		};
	}

	private hasInitiative(player: Player): boolean {
		return player === this.initiative;
	}

	private makeOrder(): Character[] {
		const ally = this.ally.getCharacters();
		const enemy = this.enemy.getCharacters();
		let order: IOrderItem[] = [];

		// serialize characters
		const characters = ally.concat(enemy)
			.map((char) => ({
				id: char.id,
				player: char.getPlayer(),
				...char.getAttributes().current
			}));

		while (order.length < orderMaxLength) {
			let act = [];

			// get characters who can act
			for (const char of characters) {
				if (char.CP >= cpLimit) {
					act.push(char);
					char.CP %= cpLimit;
				}
				char.CP += char.SPD;
			}

			// sort by character player initiative (+ sign converts boolean to number)
			act = act.sort((a, b) => {
				return (+this.hasInitiative(b.player)) - (+this.hasInitiative(a.player));
			});

			// sort by SPD
			act = act.sort((a, b) => b.SPD - a.SPD);

			// add acting characters to ordered array
			order = order.concat(act);
		}

		// convert character IDs to characters
		return order.map((char) => {
			return ally.concat(enemy).filter((c) => c.id === char.id)[0];
		});
	}
}

export default Engine;
