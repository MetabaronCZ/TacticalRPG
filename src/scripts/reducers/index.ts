import { combineReducers } from 'redux';

import { IStore } from 'store';
import parties from 'reducers/parties';
import characters from 'reducers/characters';

export default combineReducers<IStore>({
	characters,
	parties
});
