import { combineReducers } from 'redux';
import characters from 'ui/reducers/characters';
import parties from 'ui/reducers/parties';

export default combineReducers({
	characters,
	parties
});
