import { combineReducers } from 'redux';

import { IApp } from 'models/app';
import parties from 'reducers/app/parties';
import characters from 'reducers/app/characters';

export default combineReducers<IApp>({
	characters,
	parties
});
