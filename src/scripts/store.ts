import { createStore, Store } from 'redux';

import reducers from 'reducers';

import { IParty } from 'modules/party/types';
import { ICharacterData } from 'modules/character-data/types';

import { IBattleConfig } from 'engine/battle-config';

const KEY = 'game'; // storage key

export interface IStore {
	readonly battleConfig: IBattleConfig;
	readonly characters: ICharacterData[];
	readonly parties: IParty[];
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
