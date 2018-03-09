import { IScore } from 'models/score';

export enum PlayerType {
	ALLY = 'ALLY',
	ENEMY = 'ENEMY'
}

export interface IPlayer {
	name: string;
	score: IScore;
	type: PlayerType;
}
