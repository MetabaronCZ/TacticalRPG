import { createStore } from 'redux';
import { Store as ReduxStore } from 'react-redux';

import reducers from 'reducers';
import { IParty } from 'models/party';
import { ICharacterData } from 'models/character-data';

export interface IStore {
	readonly characters: ICharacterData[];
	readonly parties: IParty[];
}

export interface IAction {
	type: string;
	[data: string]: any;
}

class Store {
	public static KEY = 'game'; // storage key
	private value: ReduxStore<IStore>; // store instance

	constructor() {
		const saved = this.load();
		this.value = createStore(reducers, saved);
		this.value.subscribe(() => this.save()); // save on store changes
	}

	public get(): ReduxStore<IStore> {
		return this.value;
	}

	private getDefault(): IStore {
		return {
			characters: [],
			parties: []
		};
	}

	private load(): IStore {
		const saved = localStorage.getItem(Store.KEY) || '';

		if (!saved) {
			return this.getDefault();
		}
		try {
			return JSON.parse(saved) as IStore;
		} catch (err) {
			return this.getDefault();
		}
	}

	private save() {
		const state = this.value ? this.value.getState() : this.getDefault();
		localStorage.setItem(Store.KEY, JSON.stringify(state));
	}
}

export default Store;
