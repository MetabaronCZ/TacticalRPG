import { createStore } from 'redux';
import { Store as ReduxStore } from 'react-redux';

import reducers from 'reducers';
import { IGame, Game } from 'models/game';
import { IApp, App } from 'models/app';

export interface IState {
	app: IApp;
	game: IGame;
}

export interface IAction {
	type: string;
	[data: string]: any;
}

class Store {
	public static KEY = 'game'; // storage key
	private value: ReduxStore<IState>; // store instance

	constructor() {
		const saved = this.load();
		this.value = createStore(reducers, saved);
		this.value.subscribe(() => this.save()); // save on store changes
	}

	public get(): ReduxStore<IState> {
		return this.value;
	}

	private getDefault(): IState {
		return {
			app: App.getDefault(),
			game: Game.getDefault()
		};
	}

	private load(): IState {
		const saved = localStorage.getItem(Store.KEY) || '';

		if (!saved) {
			return this.getDefault();
		}
		try {
			return JSON.parse(saved) as IState;
		} catch (err) {
			return this.getDefault();
		}
	}

	private save() {
		const state = this.value ? this.value.getState() : this.getDefault();
		const saved = JSON.parse(JSON.stringify(state));
		saved.game = Game.getDefault();
		localStorage.setItem(Store.KEY, JSON.stringify(saved));
	}
}

export default Store;
