import { IScore, Score } from 'modules/score';

export enum PlayerType {
	ALLY = 'ALLY',
	ENEMY = 'ENEMY'
}

export interface IPlayer {
	name: string;
	score: IScore;
	type: PlayerType;
}

const create = (name: string, type: PlayerType) => {
	return {
		name,
		type,
		score: Score.getDefault()
	};
};

export const Player = {
	create
};
