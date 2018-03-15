import { IScore, Score } from 'models/score';

export enum PlayerType {
	ALLY = 'ALLY',
	ENEMY = 'ENEMY'
}

export interface IPlayer {
	name: string;
	score: IScore;
	type: PlayerType;
}

export class Player {
	public static create(name: string, type: PlayerType) {
		return {
			name,
			type,
			score: Score.getDefault()
		};
	}
}
