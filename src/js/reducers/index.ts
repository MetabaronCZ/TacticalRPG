import { combineReducers } from 'redux';
import characters from 'reducers/characters';
import parties from 'reducers/parties';
import { IState } from 'store';

export default combineReducers<IState>({
	characters,
	parties
});
