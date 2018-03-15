import { Party } from 'models/party';
import { Position } from 'models/position';
import { IOrder, Order } from 'models/order';
import { IRound, Round } from 'models/round';
import { ICharacterData } from 'models/character-data';
import { ICharacter, Character } from 'models/character';
import { IPlayer, PlayerType, Player } from 'models/player';

export interface IGame {
	characters: ICharacter[];
	ally?: IPlayer;
	enemy?: IPlayer;
	order: IOrder;
	round: IRound;
	selected?: Position;
	initiative?: PlayerType;
}

export class Game {
	public static gridSize = 12;
	public static blockSize = 64;
	public static allyPlayerName = 'Player';
	public static enemyPlayerName = 'Computer';

	public static getDefault(): IGame {
		return {
			characters: [],
			ally: Player.create(Game.allyPlayerName, PlayerType.ALLY),
			enemy: Player.create(Game.enemyPlayerName, PlayerType.ENEMY),
			order: Order.getDefault(),
			round: Round.getDefault()
		};
	}

	public static create(charIds: string[], characters: ICharacterData[]) {
		const party = charIds
			.filter(id => !!id)
			.map(id => Party.getCharacterById(id, characters));

		const ally = Player.create(Game.allyPlayerName, PlayerType.ALLY);
		const enemy = Player.create(Game.enemyPlayerName, PlayerType.ENEMY);

		const allies = party.map((char, i) => {
			return Character.create(char, new Position(i + 2, Game.gridSize - 1), PlayerType.ALLY);
		});

		const enemies = Party.getRandomCharacters(party.length)
			.map((char, i) => {
				return Character.create(char, new Position(i + 2, 0), PlayerType.ENEMY);
			});

		const initiative = (Math.random() < 0.5 ? PlayerType.ALLY : PlayerType.ENEMY);

		return {
			ally,
			enemy,
			characters: allies.concat(enemies),
			initiative
		};
	}
}

export default Game;
