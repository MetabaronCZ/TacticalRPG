import { IAction } from 'store';
import { ActionID } from 'actions/game';

import { Order } from 'models/order';
import { IGame, Game } from 'models/game';

const game = (state: IGame = Game.getDefault(), action: IAction): IGame => {
	switch (action.type) {
		case ActionID.GAME_START:
			return {
				...state,
				ally: action.ally,
				enemy: action.enemy,
				characters: action.characters,
				initiative: action.initiative
			};

		case ActionID.ORDER_UPDATE:
			return {
				...state,
				order: Order.get(state.characters, state.initiative)
			};

		case ActionID.CHARACTER_SELECT:
			return {
				...state,
				selected: action.character.position
			};

		case ActionID.GRID_SELECT:
			return {
				...state,
				selected: action.position
			};
	}
	return state;
};

export default game;
