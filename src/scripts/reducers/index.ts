import { combineReducers, ReducersMapObject } from 'redux';

import { IStore } from 'store';
import parties from 'reducers/parties';
import characters from 'reducers/characters';
import { ICharacterData } from 'modules/character-data';

export default combineReducers<IStore>({
	characters,
	parties
} as ReducersMapObject<IStore>);
