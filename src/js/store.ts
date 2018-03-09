import { createStore } from 'redux';
import { Store } from 'react-redux';

import reducers from 'reducers';
import { IAppState, defaultAppState } from 'reducers/app';
import { IGameState, defaultGameState } from 'reducers/game';

const storageKey = 'game';

export interface IState {
	app: IAppState;
	game: IGameState;
}

export interface IAction {
	type: string;
	[data: string]: any;
}

const defaultState: IState = {
	app: defaultAppState,
	game: defaultGameState
};

const loadState = (): IState => {
	const stateString = localStorage.getItem(storageKey) || '';

	if (!stateString) {
		return defaultState;
	}
	try {
		return JSON.parse(stateString) as IState;
	} catch (err) {
		return defaultState;
	}
};

const saveState = (state: IState = defaultState): void => {
	const saved = JSON.parse(JSON.stringify(state));
	saved.game = defaultGameState;
	localStorage.setItem(storageKey, JSON.stringify(saved));
};

const initStore = (): Store<IState> => {
	const state = loadState();
	const store = createStore(reducers, state);

	// save application state on store update
	store.subscribe(() => saveState(store.getState()));

	return store;
};

export default initStore;
