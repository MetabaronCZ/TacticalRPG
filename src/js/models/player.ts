import { ICharacter } from 'models/character';
import { IScore, Score } from 'models/score';

export enum PlayerType {
	ALLY = 'ALLY',
	ENEMY = 'ENEMY'
}

export interface IPlayer {
	name: string;
	score: IScore;
	characters: ICharacter[];
}

export class Player {
	public static init(name: string): IPlayer {
		return {
			name,
			score: Score.init(),
			characters: []
		};
	}
}
