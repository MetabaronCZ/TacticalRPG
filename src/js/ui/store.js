import { createStore } from 'redux';
import reducers from 'ui/reducers';

const storageKey = 'game';

const loadState = () => {
	let state = localStorage.getItem(storageKey);
	return state ? JSON.parse(state) : {};
};

const saveState = (state = {}) => {
	localStorage.setItem(storageKey, JSON.stringify(state));
};

const initStore = () => {
	let state = loadState();
	let store = createStore(reducers, state);
	store.subscribe(() => saveState(store.getState()));
	return store;
};

export default initStore;
