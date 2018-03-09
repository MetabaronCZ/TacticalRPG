import { IAction } from 'store';

import { Score } from 'models/score';
import { PlayerType } from 'models/player';

export enum ActionID {
	ADD_PLAYER = 'ADD_PLAYER',
}

const add = (name: string, playerType: PlayerType): IAction => ({
	type: ActionID.ADD_PLAYER,
	name,
	playerType,
	score: Score.init()
});

export default {
	add
};
