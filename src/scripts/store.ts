import { createStore } from 'redux';
import { Store } from 'react-redux';

import reducers from 'reducers';
import { IParty } from 'models/party';
import { ICharacterData } from 'models/character-data';

const KEY = 'game'; // storage key

export interface IStore {
	readonly characters: ICharacterData[];
	readonly parties: IParty[];
}

const getDefaultState = (): IStore => ({
	characters: [],
	parties: []
});

const load = (): IStore => {
	const state = localStorage.getItem(KEY) || '';

	if (!state) {
		return getDefaultState();
	}
	try {
		return JSON.parse(state) as IStore;
	} catch (err) {
		return getDefaultState();
	}
};

const save = (store: Store<IStore>) => {
	const state = store.getState() || getDefaultState();
	localStorage.setItem(KEY, JSON.stringify(state));
};

const initStore = (): Store<IStore> => {
	const saved = load();
	const store = createStore(reducers, saved) as Store<IStore>;

	// save on store changes
	store.subscribe(() => save(store));

	return store;
};

export default initStore;
