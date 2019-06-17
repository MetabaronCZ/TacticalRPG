import { getRandomized } from 'core/array';

import AIPresets from 'data/ai-presets';
import * as config from 'data/game-config';

import Logger from 'modules/logger';
import Act from 'modules/battle/act';
import Tile from 'modules/geometry/tile';
import Order from 'modules/battle/order';
import AIPlayer from 'modules/ai/player';
import Character from 'modules/character';
import Player from 'modules/battle/player';
import { getTile } from 'modules/geometry/tiles';
import { IBattleInfo } from 'modules/battle/battle-info';
import { DirectionID } from 'modules/geometry/direction';
import CharacterAction from 'modules/battle/character-action';
import CharacterCreationForm from 'modules/character-creation';
import { getRandomNames } from 'modules/random-name-generator';
import { PartyData, IPartyData } from 'modules/party-creation/party-data';
import { PlayerConfigList } from 'modules/battle-configuration/battle-config';
import { CharacterData, ICharacterData } from 'modules/character-creation/character-data';
import Chronox, { IChronoxRecord, IChronoxConfig, ChronoxPlayerList } from 'modules/battle/chronox';

type PlayerList = [Player, Player];

export interface IEngineState {
	running: boolean;
	tick: number;
	act: Act | null;
	players: PlayerList;
	characters: Character[];
	order: Character[];
	chronox: IChronoxRecord | null;
	battleInfo: IBattleInfo[];
}

interface IEngineEvents {
	onStart: (state: IEngineState) => void;
	onUpdate: (state: IEngineState) => void;
	onGameOver: (state: IEngineState, winner: Player) => void;
	onBattleInfo: (state: IBattleInfo[]) => void;
}

interface IEngineProps {
	readonly characters: CharacterData[];
	readonly players: PlayerConfigList;
	readonly parties: PartyData[];
	readonly events: IEngineEvents;
}

class Engine {
	private readonly players: PlayerList;
	private readonly characters: Character[] = [];
	private readonly battleInfo: IBattleInfo[] = [];
	private readonly events: IEngineEvents;

	private running = true;
	private tick = 0; // game update counter
	private actNumber = 0; // act ID
	private actors: Character[] = [];
	private act: Act | null = null;
	private order: Order;
	private chronox: Chronox;

	constructor(conf: IEngineProps) {
		this.players = this.createPlayers(conf);

		this.characters = this.players
			.map(pl => pl.getCharacters())
			.reduce((a, b) => a.concat(b));

		this.order = new Order(this.players);

		// set player order / initiative
		this.players = getRandomized(this.players) as PlayerList;

		const chronoxData = this.prepareChronoxData(conf, this.players.map(pl => pl.id));
		this.chronox = new Chronox(chronoxData);

		this.events = this.prepareEvents(conf.events);
	}

	public start() {
		this.events.onStart(this.getState());
		this.update();
	}

	public selectTile(tile: Tile) {
		if (null === this.act) {
			throw new Error('Could not select tile: invalid act');
		}
		if (!this.running) {
			return;
		}
		this.act.selectTile(tile);
	}

	public selectAction(action: CharacterAction) {
		if (null === this.act) {
			throw new Error('Could not select action: invalid act');
		}
		if (!this.running) {
			return;
		}
		this.act.selectAction(action);
	}

	public getState(): IEngineState {
		return {
			running: this.running,
			tick: this.tick,
			act: this.act,
			players: this.players,
			characters: this.characters,
			order: this.order.serialize(),
			chronox: this.chronox.serialize(),
			battleInfo: this.battleInfo
		};
	}

	private update() {
		if (!this.running) {
			return;
		}
		const winner = this.getWinner();

		if (null !== winner) {
			this.running = false;
			this.events.onGameOver(this.getState(), winner);
			return;
		}
		const { characters, order } = this;

		// update game tick counter
		this.tick++;

		// update characters
		characters.forEach(char => {
			if (!char.isDead()) {
				char.update(this.onInfo.bind(this));
			}
		});

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
		const orderChars = order.serialize();
		this.actors = actors.sort((a, b) => orderChars.indexOf(a) - orderChars.indexOf(b));

		this.startAct();
	}

	private startAct() {
		const { actors, characters, order, events } = this;
		const actor = actors[0];
		this.actors.shift();

		if (!actor) {
			// start new cycle (find actors)
			this.update();
			return;
		}
		if (actor.isDead()) {
			// skip dead actors
			this.startAct();
			return;
		}
		this.actNumber++;

		// update order
		order.update();

		// create new character act
		this.act = new Act(this.actNumber, actor, characters, {
			onBattleInfo: info => this.onInfo(info),
			onStart: act => events.onUpdate(this.getState()),
			onUpdate: act => events.onUpdate(this.getState()),
			onSkip: act => events.onUpdate(this.getState()),
			onEnd: act => {
				// store Act record
				const record = act.serialize();
				this.chronox.store(record);

				// run next act
				this.startAct();
			}
		});

		this.act.start();
	}

	private createPlayers(conf: IEngineProps): PlayerList {
		const { players, parties, characters } = conf;

		const pl = players.map((plConfig, p) => {
			const { name, party, control, aiSettings } = plConfig;
			const charData: CharacterData[] = [];
			let player: Player;

			if ('AI' === control) {
				// AI player
				const preset = aiSettings.preset;
				let aiConf = aiSettings.config;

				if ('CUSTOM' !== preset) {
					aiConf = AIPresets.get(preset).config;
				}
				player = new AIPlayer(p, name, aiConf);

			} else {
				// human controlled player
				player = new Player(p, name);
			}

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

				for (const id of selectedParty.characters) {
					const char = characters.find(ch => id === ch.id);

					if (char) {
						charData.push(char);
					}
				}
			}

			// create characters
			const chars = charData.map((data, i) => {
				let tile: Tile | null;
				let dir: DirectionID;

				// set position / orientation
				if (0 === p) {
					tile = getTile(i + 2, config.gridSize - 1);
					dir = 'TOP';
				} else {
					tile = getTile(i + 2, 0);
					dir = 'BOTTOM';
				}

				if (null === tile) {
					throw new Error('Invalid tile given');
				}
				const char = new Character(data, tile, dir, player);

				// set small random initial CP
				const ct = Math.floor((config.characterCTLimit / 10) * Math.random());
				char.attributes.set('CT', ct);

				return char;
			});

			player.setCharacters(chars);
			return player;
		});

		// set enemy for AI players
		pl.forEach(player => {
			if (player instanceof AIPlayer) {
				const enemy = pl.find(p => p !== player);

				if (!enemy) {
					throw new Error(`Could not find enemy for AI player "${player.name}"`);
				}
				player.setEnemy(enemy);
			}
		});

		return pl as PlayerList;
	}

	private prepareChronoxData(conf: IEngineProps, initiative: number[]): IChronoxConfig {
		const characters: ICharacterData[] = [];

		this.players.forEach(pl => {
			pl.getCharacters().forEach(char => {
				characters.push(char.data);
			});
		});

		const players = conf.players.map((pl, p) => ({
			...pl.serialize(),
			party: 'PARTY-' + p
		}));

		return {
			initiative,
			characters,
			players: players as ChronoxPlayerList,
			parties: this.players.map((pl, p) => {
				const chars = pl.getCharacters();

				const party: IPartyData = (conf.parties.length > p) ? conf.parties[p].serialize() : {
					id: '',
					name: 'UNKNOWN',
					creationDate: Date.now(),
					lastUpdate: Date.now(),
					slots: []
				};
				return {
					...party,
					id: 'PARTY-' + p,
					slots: Array(config.maxPartySize).fill(null).map((slot, s) => {
						return chars[s] ? chars[s].data.id : null;
					})
				};
			})
		};
	}

	private getWinner(): Player | null {
		const liveChars = this.players.map(pl => {
			const live = pl.getCharacters().filter(char => !char.isDead() && !char.status.has('DYING'));
			return {
				player: pl,
				count: live.length
			};
		});

		if (0 === liveChars[0].count) {
			return liveChars[1].player;
		}
		if (0 === liveChars[1].count) {
			return liveChars[0].player;
		}
		return null;
	}

	private prepareEvents(events: IEngineEvents): IEngineEvents {
		return {
			onStart: state => {
				Logger.info('Engine onStart');
				events.onStart(state);
			},
			onUpdate: events.onUpdate,
			onGameOver: (state, winner) => {
				Logger.info('Engine onGameOver');
				Logger.info(`Player "${winner.name}" won!`);
				events.onGameOver(state, winner);
			},
			onBattleInfo: events.onBattleInfo
		};
	}

	private onInfo(info: IBattleInfo, duration = 3000) {
		const { battleInfo, events } = this;

		// set battle info item
		battleInfo.push(info);
		events.onBattleInfo(battleInfo);

		// remove battle info item after fixed amount of time
		setTimeout(() => {
			if (!this.running) {
				return;
			}
			for (let i = 0, imax = battleInfo.length; i < imax; i++) {
				if (battleInfo[i] === info) {
					battleInfo.splice(i, 1);
					events.onBattleInfo(battleInfo);
					break;
				}
			}
		}, duration);
	}
}

export default Engine;
