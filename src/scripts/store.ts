import { createStore, Store } from 'redux';

import reducers from 'reducers';

import { IPartyData } from 'engine/party-data';
import { IBattleConfig } from 'engine/battle-config';
import { ICharacterData } from 'engine/character-data';

const KEY = 'game'; // storage key

export interface IStore {
	readonly battleConfig: IBattleConfig;
	readonly characters: ICharacterData[];
	readonly parties: IPartyData[];
}

const getDefaultState = (): IStore => ({
	battleConfig: {
		players: []
	},
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

const initStore = () => {
	const saved = load();
	const store = createStore(reducers, saved);

	// save on store changes
	store.subscribe(() => save(store));

	return store;
};

export default initStore;
