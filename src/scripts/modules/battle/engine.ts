import { randomizeArray } from 'core/array';
import * as config from 'data/game-config';

import Logger from 'modules/logger';
import Act from 'modules/battle/act';
import Order from 'modules/battle/order';
import Character from 'modules/character';
import Player from 'modules/battle/player';
import Position from 'modules/geometry/position';
import { getPosition } from 'modules/geometry/positions';
import { DirectionID } from 'modules/geometry/direction';
import { PartyData } from 'modules/party-creation/party-data';
import CharacterAction from 'modules/battle/character-action';
import CharacterCreationForm from 'modules/character-creation';
import { getRandomNames } from 'modules/random-name-generator';
import { PlayerConfig } from 'modules/battle-configuration/player-config';
import { CharacterData } from 'modules/character-creation/character-data';
import { IBattleInfo } from 'modules/battle/battle-info';

export interface IEngineState {
	tick: number;
	act: Act|null;
	players: Player[];
	characters: Character[];
	order: Character[];
	battleInfo: IBattleInfo[];
}

interface IEngineEvents {
	onStart: (state: IEngineState) => void;
	onUpdate: (state: IEngineState) => void;
	onGameOver: (state: IEngineState) => void;
}

interface IEngineProps {
	readonly players: PlayerConfig[];
	readonly parties: PartyData[];
	readonly events: IEngineEvents;
}

class Engine {
	private readonly players: Player[] = [];
	private readonly characters: Character[] = [];
	private readonly battleInfo: IBattleInfo[] = [];
	private readonly events: IEngineEvents;

	private tick = 0; // game update counter
	private actNumber = 0; // act ID
	private actors: Character[] = [];
	private act: Act|null = null;
	private order: Order;

	constructor(conf: IEngineProps) {
		this.players = this.createPlayers(conf.players, conf.parties);
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

		// update game tick counter
		this.tick++;

		// update characters
		characters.forEach(char => char.update());

		// update order
		order.update();

		// get actors
		const actors = characters.filter(char => !char.isDead() && char.attributes.CT >= config.characterCTLimit);

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
			onBattleInfo: info => this.onInfo,
			onEnd: act => {
				// run next act
				this.act = null;
				this.startAct();
			}
		});

		this.act.start();
	}

	private createPlayers(players: PlayerConfig[], parties: PartyData[]): Player[] {
		if (config.maxPlayers !== players.length) {
			throw new Error(`Game has to have exactly ${config.maxPlayers} players`);
		}
		const pl = players.map((conf, p) => {
			const { name, party, control } = conf;
			let charData: CharacterData[] = [];

			// get character data
			if (config.randomPartyID === party) {
				// random generated party
				const charNames = getRandomNames(config.maxPartySize, config.maxPartyNameLength);

				for (const n of charNames) {
					const charCreation = new CharacterCreationForm(null);
					charCreation.change('name', n);
					charCreation.randomize();

					const char = charCreation.get();

					if (char) {
						charData.push(char);
					}
				}

			} else {
				// user created party
				const selectedParty = parties.find(pt => party === pt.id);

				if (!selectedParty) {
					throw new Error(`Could not create player "${name}": Invalid party selected`);
				}
				charData = selectedParty.characters;
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
				const char = new Character(data, pos, dir, p, this.onInfo);

				// set small random initial CP
				const ct = Math.floor((config.characterCTLimit / 10) * Math.random());
				char.attributes.set('CT', ct);

				return char;
			});

			return new Player(name, control, chars);
		});

		return randomizeArray(pl);
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
			order: this.order.get(),
			battleInfo: this.battleInfo
		};
	}

	private prepareEvents(events: IEngineEvents): IEngineEvents {
		return {
			onStart: state => {
				Logger.info('Engine onStart');
				events.onStart(state);
			},
			onUpdate: events.onUpdate,
			onGameOver: state => {
				Logger.info('Engine onGameOver');
				events.onGameOver(state);
			}
		};
	}

	private onInfo(info: IBattleInfo, duration = 3000) {
		const infos = this.battleInfo;

		// set battle info item
		infos.push(info);
		this.update();

		// remove battle info item after fixed amount of time
		setTimeout(() => {
			for (let i = 0, imax = infos.length; i < imax; i++) {
				if (infos[i] === info) {
					infos.splice(i, 1);
					this.update();
					break;
				}
			}
		}, duration);
	}
}

export default Engine;
