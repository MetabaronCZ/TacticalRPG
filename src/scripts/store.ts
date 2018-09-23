import { createStore, Store } from 'redux';

import reducers from 'reducers';

import Logger from 'engine/logger';
import { IBattleConfig } from 'engine/battle-config';
import { IPartyData, PartyData } from 'engine/party-data';
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
	readonly parties: PartyData[];
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

		// prepare character data
		const characters: CharacterData[] = [];

		for (const char of data.characters) {
			if (!char) {
				continue;
			}
			const charData = new CharacterData(char);

			if (charData.isValid()) {
				characters.push(charData);
			} else {
				Logger.error(`Invalid character "${JSON.stringify(charData.serialize())}"`);
			}
		}

		// prepare party data
		const parties: PartyData[] = [];

		for (const party of data.parties) {
			if (!party) {
				continue;
			}
			const partyData = new PartyData(party, characters);

			if (partyData.isValid()) {
				parties.push(partyData);
			} else {
				Logger.error(`Invalid party "${JSON.stringify(partyData.serialize())}"`);
			}
		}

		return {
			...data,
			characters,
			parties
		} as IStore;

	} catch (err) {
		return getDefaultState();
	}
};

const save = (store: Store<IStore>) => {
	const state = store.getState() || getDefaultState();
	const data: ISaveState = {
		...state,
		characters: state.characters.map(char => char.serialize()),
		parties: state.parties.map(party => party.serialize())
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
