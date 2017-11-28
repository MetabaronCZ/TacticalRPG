import { getRandomParty } from 'utils/party';
import { IParty } from 'models/party';
import { ICharacter } from 'models/character';
import { IAttributes } from 'models/attributes';
import Character, { ICharacterConfig } from 'engine/character';
import Player from 'engine/player';

const orderMaxLength: number = 20;
const cpLimit: number = 100;

export interface IEngineConfig {
	party: IParty;
	size: number;
}

interface IOrderItem extends IAttributes {
	id: string;
	player: Player;
}

class Engine {
	private ally: Player;
	private enemy: Player;
	private initiative: Player;

	constructor(conf: IEngineConfig) {
		const { party, size } = conf;
		const ally: ICharacterConfig[] = [];
		const enemy: ICharacterConfig[] = [];

		// filter out non-existent characters and assign party character positions
		party.characters.filter((char: ICharacter) => char)
			.forEach((char: ICharacter, i: number) => {
				const charConfig: ICharacterConfig = {
					...char,
					position: [i + 2, 0]
				};
				ally.push(charConfig);
			});

		this.ally = new Player(ally, false);

		// create random enemy party
		const enemyParty: IParty = getRandomParty(party.characters.length);

		// assign enemy character positions
		enemyParty.characters
			.forEach((char: ICharacter, i: number) => {
				const charConfig: ICharacterConfig = {
					...char,
					position: [i + 2, size - 1]
				};
				enemy.push(charConfig);
			});

		this.enemy = new Player(enemy, true);

		// which player is attacking
		this.initiative = Math.random() < 0.5 ? this.ally : this.enemy;
	}

	public getParty(): Character[] {
		return this.ally.getCharacters();
	}

	public getOrder(): Character[] {
		const ally: Character[] = this.ally.getCharacters();
		const enemy: Character[] = this.enemy.getCharacters();
		let order: IOrderItem[] = [];

		// serialize characters
		const characters: IOrderItem[] = ally.concat(enemy)
			.map((char: Character) => ({
				id: char.id,
				player: char.getPlayer(),
				...char.getAttributes().current
			}));

		while (order.length < orderMaxLength) {
			let act: IOrderItem[] = [];

			// get characters who can act
			for (const char of characters) {
				if (char.CP >= cpLimit) {
					act.push(char);
					char.CP %= cpLimit;
				}
				char.CP += char.SPD;
			}

			// sort by character player initiative
			act = act.sort((a, b) => {
				const initPlayer: Player = this.initiative;
				return +(initPlayer === b.player) - +(initPlayer === a.player);
			});

			// sort by SPD
			act = act.sort((a, b) => b.SPD - a.SPD);

			// add acting characters to order array
			order = order.concat(act);
		}

		// convert character IDs to characters
		return order.map((char: IOrderItem) => {
			return ally.concat(enemy).filter((c: Character) => c.id === char.id)[0];
		});
	}
}

export default Engine;
