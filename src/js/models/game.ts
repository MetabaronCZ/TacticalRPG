import { PlayerType, Player, IPlayer } from 'models/player';
import { ICharacter, Character } from 'models/character';
import { ICharacterData } from 'models/character-data';
import { Party } from 'models/party';
import { Position } from 'models/position';
import { Order } from 'models/order';
import { IGame } from 'models/game';

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
	public static init(charIds: string[], characters: ICharacterData[], size: number): IGame {
		const party = charIds.filter((id) => !!id).map((id) => Party.getCharacterById(id, characters));
		const chars: ICharacter[] = [];

		const ally = party;
		const enemy = Party.getRandomCharacters(party.length);
		const initiative = (Math.random() < 0.5 ? PlayerType.ALLY : PlayerType.ENEMY);

		// initialize characters
		party.map((ch, i) => {
			chars.push(Character.create(PlayerType.ALLY, ally[i], new Position(i + 2, size - 1)));
			chars.push(Character.create(PlayerType.ENEMY, enemy[i], new Position(i + 2, 0)));
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
