import { combineReducers } from 'redux';
import characters from 'reducers/characters';
import parties from 'reducers/parties';

export default combineReducers({
	characters,
	parties
});
