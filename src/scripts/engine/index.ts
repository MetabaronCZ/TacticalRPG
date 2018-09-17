import { randomize } from 'core/array';

import RandomNameGenerator from 'core/random-name-generator';

import nameSamples from 'data/names';
import * as config from 'data/game-config';

import Act from 'engine/act';
import Order from 'engine/order';
import Logger from 'engine/logger';
import Player from 'engine/player';
import Position from 'engine/position';
import Character from 'engine/character';
import DirectionID from 'engine/direction';
import { getPosition } from 'engine/positions';
import { IPlayerData } from 'engine/player-data';
import CharacterAction from 'engine/character-action';
import { ICharacterData } from 'engine/character-data';
import { getRandomCharacterData } from 'engine/utils/character-data';

export interface IEngineState {
	tick: number;
	act: Act|null;
	players: Player[];
	characters: Character[];
	order: Character[];
}

interface IEngineEvents {
	onStart: (state: IEngineState) => void;
	onUpdate: (state: IEngineState) => void;
	onGameOver: (state: IEngineState) => void;
}

interface IEngineProps {
	readonly players: IPlayerData[];
	readonly events: IEngineEvents;
}

class Engine {
	private readonly players: Player[] = [];
	private readonly characters: Character[] = [];
	private readonly events: IEngineEvents;

	private tick = 0; // game update counter
	private actNumber = 0; // act ID
	private actors: Character[] = [];
	private act: Act|null = null;
	private order: Order;

	constructor(conf: IEngineProps) {
		this.players = this.createPlayers(conf.players);
		this.characters = this.players.map(pl => pl.characters).reduce((a, b) => a.concat(b));
		this.order = new Order(this.players);
		this.events = this.prepareEvents(conf.events);
	}

	public start() {
		this.events.onStart(this.getState());
		this.update();
	}

	public selectTile(position: Position) {
		if (null === this.act) {
			throw new Error('Could not select tile: invalid act');
		}
		this.act.selectTile(position);
	}

	public selectAction(action: CharacterAction) {
		if (null === this.act) {
			throw new Error('Could not select action: invalid act');
		}
		this.act.selectAction(action);
	}

	private update() {
		if (null !== this.act) {
			throw new Error('Could not update engine: a act is in progress');
		}
		if (this.checkWinConditions()) {
			this.events.onGameOver(this.getState());
			return;
		}
		const { characters, order } = this;
		const liveChars = characters.filter(char => !char.isDead());

		// update game tick counter
		this.tick++;

		// update characters
		liveChars.forEach(char => char.update());

		// update order
		order.update();

		// get actors
		const actors = liveChars.filter(char => char.attributes.get('CT') >= config.characterCTLimit);

		// if no actor present, continue updating
		if (!actors.length) {
			this.update();
			return;
		}

		// order actors
		const orderChars = order.get();
		this.actors = actors.sort((a, b) => orderChars.indexOf(a) - orderChars.indexOf(b));

		this.startAct();
	}

	private startAct() {
		const { actors, characters, order, events } = this;
		const actor = actors[0];
		this.actors.shift();

		if (!actor) {
			// start new cycle
			this.update();
			return;
		}
		this.actNumber++;

		// update order
		order.update();

		// create new character act
		this.act = new Act(this.actNumber, actor, characters, {
			onStart: act => events.onUpdate(this.getState()),
			onUpdate: act => events.onUpdate(this.getState()),
			onEnd: act => {
				// run next act
				this.act = null;
				this.startAct();
			}
		});

		this.act.start();
	}

	private createPlayers(playerData: IPlayerData[]): Player[] {
		if (config.maxPlayers !== playerData.length) {
			throw new Error(`Game has to have exactly ${config.maxPlayers} players`);
		}
		const players = playerData.map((conf, p) => {
			const { name, control, party, parties, characters } = conf;
			let charData: ICharacterData[];

			// get character data
			if (config.randomPartyID === party) {
				// random generated party
				const charNames = RandomNameGenerator.get(nameSamples, config.characterCount, config.maxPartyNameLength);
				charData = charNames.map(n => getRandomCharacterData(n));

			} else {
				// user created party
				const selectedParty = parties.find(pt => party === pt.id);

				if (!selectedParty) {
					throw new Error(`Could not create player "${name}": Invalid party selected`);
				}
				charData = selectedParty.characters
					.map(id => characters.filter(char => char.id === id)[0]) // convert party character IDs to character data
					.filter(char => !!char); // filter empty slots
			}

			// create characters
			const chars = charData.map((data, i) => {
				let pos: Position|null;
				let dir: DirectionID;

				// set position / orientation
				if (0 === p) {
					pos = getPosition(i + 2, config.gridSize - 1);
					dir = 'TOP';
				} else {
					pos = getPosition(i + 2, 0);
					dir = 'BOTTOM';
				}

				if (null === pos) {
					throw new Error('Invalid position given');
				}
				const char = new Character(data, pos, dir, p);

				// set small random initial CP
				const ct = Math.floor((config.characterCTLimit / 10) * Math.random());
				char.attributes.set('CT', ct);

				return char;
			});

			return new Player(name, control, chars);
		});

		return randomize(players);
	}

	private checkWinConditions(): boolean {
		const { players } = this;

		for (const pl of players) {
			const liveChars = pl.characters.filter(char => !char.isDead());

			if (0 === liveChars.length) {
				return true;
			}
		}
		return false;
	}

	private getState(): IEngineState {
		return {
			tick: this.tick,
			act: this.act,
			players: this.players,
			characters: this.characters,
			order: this.order.get()
		};
	}

	private prepareEvents(events: IEngineEvents): IEngineEvents {
		return {
			onStart: state => {
				Logger.log('Engine onStart');
				events.onStart(state);
			},
			onUpdate: events.onUpdate,
			onGameOver: state => {
				Logger.log('Engine onGameOver');
				events.onGameOver(state);
			}
		};
	}
}

export default Engine;
