import { PlayerType, Player, IPlayer } from 'models/player';
import { ICharacter, Character } from 'models/character';
import { ICharacterData } from 'models/character-data';
import { Position } from 'models/position';
import { Party } from 'models/party';
import { Order } from 'models/order';

const allyPlayerName = 'Player';
const enemyPlayerName = 'Computer';

export interface IGame {
	ally: IPlayer;
	enemy: IPlayer;
	characters: ICharacter[];
	order: string[];
	initiative: PlayerType;
}

export class Game {
	public static gridSize = 12;
	public static blockSize = 64;

	public static init(charIds: string[], characters: ICharacterData[]): IGame {
		const party = charIds
			.filter((id) => !!id)
			.map((id) => Party.getCharacterById(id, characters));

		const ally = party;
		const enemy = Party.getRandomCharacters(party.length);
		const initiative = (Math.random() < 0.5 ? PlayerType.ALLY : PlayerType.ENEMY);
		const chars: ICharacter[] = [];

		// initialize characters
		party.forEach((ch, i) => {
			const posAlly = new Position(i + 2, this.gridSize - 1);
			const posEnemy = new Position(i + 2, 0);
			const charAlly = Character.create(PlayerType.ALLY, ally[i], posAlly);
			const charEnemy = Character.create(PlayerType.ENEMY, enemy[i], posEnemy);

			chars.push(charAlly);
			chars.push(charEnemy);
		});

		// set small random initial CP
		for (const char of chars) {
			char.currAttributes.CP = Math.floor(10 * Math.random());
		}

		return {
			ally: Player.init(allyPlayerName),
			enemy: Player.init(enemyPlayerName),
			characters: chars,
			order: Order.make(chars, initiative),
			initiative
		};
	}
}
