import { randomize } from 'core/array';
import { characterCTLimit, gridSize } from 'data/game-config';

import Act from 'engine/act';
import Order from 'engine/order';
import Position from 'engine/position';
import Character from 'engine/character';
import Player, { IPlayerData } from 'engine/player';
import CharacterAction from 'engine/character-action';

export interface IEngineState {
	tick: number;
	act: Act|null;
	players: Player[];
	characters: Character[];
	order: Character[];
}

interface IEngineEvents {
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
		this.characters = this.players.map(pl => pl.getCharacters()).reduce((a, b) => a.concat(b));
		this.order = new Order(this.players);
		this.events = conf.events;

		// init engine
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
		const actors = liveChars.filter(char => char.getAttribute('CT') >= characterCTLimit);

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
			onUpdate: () => events.onUpdate(this.getState()),
			onEnd: () => {
				// run next act
				this.act = null;
				this.startAct();
			}
		});

		events.onUpdate(this.getState());
	}

	private createPlayers(playerData: IPlayerData[]): Player[] {
		if (2 !== playerData.length) {
			throw new Error('Game has to have exactly two players');
		}
		const players = playerData.map((data, p) => {
			const player = new Player(data);

			player.getCharacters().forEach((char, i) => {
				// set position / orientation
				if (0 === p) {
					char.setPosition(new Position(i + 2, gridSize - 1));
					char.setDirection('TOP');
				} else if (1 === p) {
					char.setPosition(new Position(i + 2, 0));
					char.setDirection('BOTTOM');
				}

				// set small random initial CP
				const ct = Math.floor((characterCTLimit / 10) * Math.random());
				char.setAttribute('CT', ct);
			});

			return player;
		});

		return randomize(players);
	}

	private checkWinConditions(): boolean {
		const { players } = this;

		for (const pl of players) {
			const liveChars = pl.getCharacters().filter(char => !char.isDead());

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
}

export default Engine;
