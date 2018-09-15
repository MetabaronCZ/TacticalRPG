import { combineReducers, ReducersMapObject } from 'redux';

import { IStore } from 'store';
import parties from 'reducers/parties';
import characters from 'reducers/characters';
import battleConfig from 'reducers/battle-config';

export default combineReducers<IStore>({
	battleConfig,
	characters,
	parties
} as ReducersMapObject<IStore>);
