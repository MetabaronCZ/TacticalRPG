import { getRandomized } from 'core/array';

import * as config from 'data/game-config';

import { getTile } from 'modules/geometry/tiles';
import { getRandomNames } from 'modules/random-name-generator';

import Logger from 'modules/logger';
import Act from 'modules/battle/act';
import Tile from 'modules/geometry/tile';
import Order from 'modules/battle/order';
import AIPlayer from 'modules/ai/player';
import Character from 'modules/character';
import Player, { IPlayerCharacterSetup } from 'modules/battle/player';
import Command from 'modules/battle/command';
import { IBattleInfo } from 'modules/battle/battle-info';
import { DirectionID } from 'modules/geometry/direction';
import { PartyData } from 'modules/party-creation/party-data';
import CharacterCreationForm from 'modules/character-creation';
import Chronox, { IChronoxRecord } from 'modules/battle/chronox';
import { CharacterData } from 'modules/character-creation/character-data';
import { PlayerConfigList } from 'modules/battle-configuration/battle-config';

export type PlayerList = [Player, Player];

export interface IEngineState {
	running: boolean;
	tick: number;
	act: Act | null;
	order: Character[];
	battleInfo: IBattleInfo[];
	readonly players: PlayerList;
	readonly characters: Character[];
	readonly chronox: IChronoxRecord;
}

interface IEngineEvents {
	readonly onStart: (state: IEngineState) => void;
	readonly onUpdate: (state: IEngineState) => void;
	readonly onGameOver: (state: IEngineState, winner: Player) => void;
	readonly onBattleInfo: (state: IBattleInfo[]) => void;
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

	private running = false;
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

		const chronoxConf = Chronox.getConfig(this.players, conf.parties);
		this.chronox = new Chronox(chronoxConf);

		this.events = this.prepareEvents(conf.events);
	}

	public start() {
		if (this.running) {
			return;
		}
		this.running = true;

		this.events.onStart(this.getState());
		this.update();
	}

	public selectTile(tile: Tile) {
		if (!this.act) {
			throw new Error('Could not select tile: invalid act');
		}
		if (!this.running) {
			return;
		}
		this.act.selectTile(tile);
	}

	public selectCommand(command: Command) {
		if (!this.act) {
			throw new Error('Could not select command: invalid act');
		}
		if (!this.running) {
			return;
		}
		this.act.selectCommand(command);
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

		if (winner) {
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
		const actID = this.actNumber;

		Logger.info(`ACT ${actID} (Tick ${this.tick})`);

		this.act = new Act(actID, actor, characters, {
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
	}

	private createPlayers(conf: IEngineProps): PlayerList {
		const { parties, characters } = conf;

		// set player order / initiative
		const playerData = getRandomized(conf.players);

		const pl = playerData.map((plData, p) => {
			const player = plData.serialize();
			const { name, party, control, aiSettings } = player;
			const charData: CharacterData[] = [];

			// get character data
			if (config.randomPartyID === party) {
				// randomly generated party
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

			// create character setup
			const setup: IPlayerCharacterSetup[] = charData.map((data, i) => {
				let position: Tile | null;
				let direction: DirectionID;

				// set position / orientation
				if (0 === p) {
					position = getTile(i + 2, config.gridSize - 1);
					direction = 'TOP';
				} else {
					position = getTile(i + 2, 0);
					direction = 'BOTTOM';
				}

				if (!position) {
					throw new Error('Invalid tile given');
				}
				return { data, position, direction } as IPlayerCharacterSetup;
			});

			if ('AI' === control) {
				// AI player
				const selectTile = (tile: Tile) => this.selectTile(tile);
				const selectCommand = (cmd: Command) => this.selectCommand(cmd);
				return new AIPlayer(player, setup, aiSettings, selectTile, selectCommand);

			} else {
				// user controlled player
				return new Player(player, setup);
			}
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
