import { createStore, Store } from 'redux';

import reducers from 'reducers';

import { IPartyData } from 'engine/party-data';
import { IBattleConfig } from 'engine/battle-config';
import { ICharacterData, CharacterData } from 'engine/character-data';

const KEY = 'game'; // storage key

interface ISaveState {
	readonly battleConfig: IBattleConfig;
	readonly characters: ICharacterData[];
	readonly parties: IPartyData[];
}

export interface IStore {
	readonly battleConfig: IBattleConfig;
	readonly characters: CharacterData[];
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
		const data = JSON.parse(state) as ISaveState;
		return {
			...data,
			characters: data.characters.map((char: ICharacterData) => new CharacterData(char))
		} as IStore;

	} catch (err) {
		return getDefaultState();
	}
};

const save = (store: Store<IStore>) => {
	const state = store.getState() || getDefaultState();
	const data: ISaveState = {
		...state,
		characters: state.characters.map(char => char.serialize())
	};
	localStorage.setItem(KEY, JSON.stringify(data));
};

const initStore = () => {
	const saved = load();
	const store = createStore(reducers, saved);

	// save on store changes
	store.subscribe(() => save(store));

	return store;
};

export default initStore;
