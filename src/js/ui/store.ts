import { createStore } from 'redux';
import { Store } from 'react-redux';
import reducers from 'ui/reducers';

export interface IState {
	characters?: any[];
	parties?: any[];
}

const storageKey: string = 'game';

const loadState = (): IState => {
	const state: string = localStorage.getItem(storageKey) || '';
	return state ? JSON.parse(state) : {};
};

const saveState = (state: IState = {}): void => {
	localStorage.setItem(storageKey, JSON.stringify(state));
};

const initStore = (): Store<IState> => {
	const state: IState = loadState();
	const store: Store<IState> = createStore(reducers, state);

	// save application state on store update
	store.subscribe(() => saveState(store.getState()));

	return store;
};

export default initStore;
