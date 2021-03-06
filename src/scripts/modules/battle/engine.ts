import { getRandomized } from 'core/array';
import * as config from 'data/game-config';

import { getCharacterPositions } from 'modules/battle/grid';
import { getRandomNames } from 'modules/random-name-generator';

import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import AIPlayer from 'modules/ai/player';
import Act, { IActSnapshot } from 'modules/battle/act';
import { IBattleInfo } from 'modules/battle/battle-info';
import { DirectionID } from 'modules/geometry/direction';
import Order, { IOrderSnapshot } from 'modules/battle/order';
import CharacterCreationForm from 'modules/character-creation';
import { IPartyData } from 'modules/party-creation/party-data';
import Chronox, { IChronoxRecord } from 'modules/battle/chronox';
import Character, { ICharacterSnapshot } from 'modules/character';
import Player, { IPlayerCharacterSetup } from 'modules/battle/player';
import { ICharacterData } from 'modules/character-creation/character-data';
import { PlayerConfigList } from 'modules/battle-configuration/battle-config';
import SuddenDeath, { ISuddenDeathSnapshot } from 'modules/battle/sudden-death';

const charPositions = getCharacterPositions();

export type PlayerList = [Player, Player];

export interface IEngineSnapshot {
	readonly running: boolean;
	readonly tick: number;
	readonly order: IOrderSnapshot;
	readonly act: IActSnapshot | null;
	readonly battleInfo: IBattleInfo[];
	readonly characters: ICharacterSnapshot[];
	readonly suddenDeath: ISuddenDeathSnapshot;
	readonly chronox: IChronoxRecord;
}

interface IEngineEvents {
	readonly onBattleInfo: (info: IBattleInfo[]) => void;
	readonly onUpdate: (engine: IEngineSnapshot) => void;
	readonly onGameOver: (engine: IEngineSnapshot, winner: Player | null) => void;
}

interface IEngineProps {
	readonly characters: ICharacterData[];
	readonly players: PlayerConfigList;
	readonly parties: IPartyData[];
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

	private readonly order: Order;
	private readonly chronox: Chronox;
	private readonly suddenDeath: SuddenDeath;

	constructor(conf: IEngineProps) {
		this.events = conf.events;
		this.players = this.createPlayers(conf);

		this.characters = this.players
			.map(pl => pl.getCharacters())
			.reduce((a, b) => a.concat(b));

		this.order = new Order(this.characters, this.players);

		const chronoxConf = Chronox.getConfig(this.players, conf.parties);
		this.chronox = new Chronox(chronoxConf);

		this.suddenDeath = new SuddenDeath(
			this.characters,
			() => this.events.onUpdate(this.serialize()),
			info => this.onInfo(info)
		);
	}

	public start(): void {
		if (this.running) {
			return;
		}
		this.running = true;
		Logger.info('Engine onStart');

		this.events.onUpdate(this.serialize());
		this.update();
	}

	public selectTile(tile: Tile): void {
		if (!this.act) {
			throw new Error('Could not select tile: invalid act');
		}
		if (!this.running) {
			return;
		}
		this.act.selectTile(tile);
	}

	public selectCommand(commandID: string): void {
		if (!this.act) {
			throw new Error('Could not select command: invalid act');
		}
		if (!this.running) {
			return;
		}
		this.act.selectCommand(commandID);
	}

	private serialize(): IEngineSnapshot {
		return {
			running: this.running,
			tick: this.tick,
			act: (this.act ? this.act.serialize() : null),
			characters: this.characters.map(char => char.serialize()),
			order: this.order.serialize(),
			chronox: this.chronox.serialize(),
			suddenDeath: this.suddenDeath.serialize(),
			battleInfo: this.battleInfo
		};
	}

	private update(): void {
		if (!this.running) {
			return;
		}
		const { characters, order } = this;

		// update game tick counter
		this.tick++;

		// update sudden death mode state
		this.suddenDeath.update(this.tick, timeup => {
			if (timeup) {
				// sudden death mode ends - check resulting characters
				const winner = this.getWinner();
				this.gameOver(winner);

			} else {
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
				const orderChars = order.get();
				this.actors = actors.sort((a, b) => orderChars.indexOf(a) - orderChars.indexOf(b));

				this.startAct();
			}
		});
	}

	private startAct(): void {
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

		this.act = new Act(actID, actor, characters, {
			onUpdate: cb => {
				const state = this.serialize();
				events.onUpdate(state);
				cb(state);
			},
			onBattleInfo: info => this.onInfo(info),
			onEnd: act => {
				// store Act record
				const record = act.getRecord();
				this.chronox.store(record);

				const winner = this.getWinner();

				if (winner) {
					// finish game
					this.gameOver(winner);

				} else {
					// run next act
					events.onUpdate(this.serialize());
					this.startAct();
				}
			}
		});

		// start Act
		Logger.info('--------------------------------');
		Logger.info(`ACT ${actID} (Tick ${this.tick})`);

		const state = this.serialize();
		events.onUpdate(state);

		this.act.start(state);
	}

	private createPlayers(conf: IEngineProps): PlayerList {
		const { parties, characters } = conf;

		// set player order / initiative
		const playerData = getRandomized(conf.players);

		const pl = playerData.map((plData, p) => {
			const player = plData.serialize();
			const { name, party, control } = player;
			const charData: ICharacterData[] = [];

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

				for (const id of selectedParty.slots) {
					const char = characters.find(ch => id === ch.id);

					if (char) {
						charData.push(char);
					}
				}
			}

			// create character setup
			const setup: IPlayerCharacterSetup[] = charData.map((data, i) => {
				const position: Tile | null = charPositions[p][i];
				const direction: DirectionID = (p > 0 ? 'S' : 'N');

				if (!position) {
					throw new Error('Invalid tile given');
				}
				return { data, position, direction } as IPlayerCharacterSetup;
			});

			if ('AI' === control) {
				return new AIPlayer(player, setup, this);
			} else {
				return new Player(player, setup);
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

	private gameOver(winner: Player | null): void {
		this.running = false;

		Logger.info('Engine onGameOver');
		Logger.info('--------------------------------');

		if (winner) {
			Logger.info(`Player "${winner.name}" won!`);
		} else {
			Logger.info('Game has no winner!');
		}
		this.events.onGameOver(this.serialize(), winner);
	}

	private onInfo(info: IBattleInfo, duration = 3000): void {
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
