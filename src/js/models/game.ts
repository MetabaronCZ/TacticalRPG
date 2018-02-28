import { Party } from 'models/party';
import { Position } from 'models/position';
import { IOrder, Order } from 'models/order';
import { IRound, Round } from 'models/round';
import { ICharacterData } from 'models/character-data';
import { ICharacter, Character } from 'models/character';
import { PlayerType, Player, IPlayer } from 'models/player';

const allyPlayerName = 'Player';
const enemyPlayerName = 'Computer';

export interface IGame {
	round: IRound;
	order: IOrder;
	ally: IPlayer;
	enemy: IPlayer;
	characters: ICharacter[];
	initiative: PlayerType;
}

export type IOnGridSelect = (pos: Position) => void;
export type IOnCharacterSelect = (char: ICharacter) => void;

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
		const order = Order.make(chars, initiative);
		const round = Round.init(order);

		return {
			ally: Player.init(allyPlayerName),
			enemy: Player.init(enemyPlayerName),
			characters: chars,
			order,
			round,
			initiative
		};
	}

	public static onGridSelect(pos: Position) {
		// TODO: show block info or character goto block
		console.log('GRID selected', pos);
	}

	public static onCharacterSelect(char: ICharacter) {
		// TODO: show character info or select character for action
		console.log('CHARACTER selected', char);
	}
}
