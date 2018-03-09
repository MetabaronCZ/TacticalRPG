import { IOrder } from 'models/order';
import { IPlayer } from 'models/player';
import { ICharacter } from 'models/character';
import { IRound, Round } from 'models/round';

export interface IGame {
	characters: ICharacter[];
	players: IPlayer[];
	order: IOrder;
	round: IRound;
	selected?: Position;
}

export class Game {
	public static getDefault(): IGame {
		return {
			characters: [],
			players: [],
			order: [],
			round: Round.getDefault()
		};
	}
}

export default Game;
