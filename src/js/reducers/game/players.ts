import { IAction } from 'store';
import { ActionID } from 'actions/game/players';

import { Score } from 'models/score';
import { IPlayer } from 'models/player';

const players = (state: IPlayer[] = [], action: IAction): IPlayer[] => {
	switch (action.type) {
		case ActionID.ADD_PLAYER:
			return state.concat({
				name: action.name,
				type: action.playerType,
				score: Score.init()
			});
	}
	return state;
};

export default players;
