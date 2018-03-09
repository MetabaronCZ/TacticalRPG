import { combineReducers } from 'redux';

import { IGame } from 'models/game';

import order from 'reducers/game/order';
import round from 'reducers/game/round';
import players from 'reducers/game/players';
import characters from 'reducers/game/characters';

export default combineReducers<IGame>({
	characters,
	players,
	order,
	round
});
