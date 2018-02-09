import { createStore } from 'redux';
import { Store } from 'react-redux';
import reducers from 'reducers';
import { ICharacterData } from 'models/character';

export interface IState {
	readonly characters?: ICharacterData[];
	readonly parties?: any[];
}

export interface IAction {
	type: string;
	[data: string]: any;
}

const storageKey = 'game';

const loadState = (): IState => {
	const state = localStorage.getItem(storageKey) || '';
	return state ? JSON.parse(state) : {};
};

const saveState = (state: IState = {}): void => {
	localStorage.setItem(storageKey, JSON.stringify(state));
};

const initStore = (): Store<IState> => {
	const state = loadState();
	const store = createStore(reducers, state);

	// save application state on store update
	store.subscribe(() => saveState(store.getState()));

	return store;
};

export default initStore;
