import { combineReducers } from 'redux';

import app from 'reducers/app';
import game from 'reducers/game';
import { IState } from 'store';

export default combineReducers<IState>({
	app,
	game
});
