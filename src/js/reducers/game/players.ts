import { IAction } from 'store';
import { ActionID } from 'actions/game/players';
import { IPlayer, Player } from 'models/player';

const players = (state: IPlayer[] = [], action: IAction): IPlayer[] => {
	switch (action.type) {
		case ActionID.ADD_PLAYER:
			return [...state, Player.create(action.name, action.playerType)];
	}
	return state;
};

export default players;
