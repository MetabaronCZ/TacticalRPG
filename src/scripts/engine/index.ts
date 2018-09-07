import { randomize } from 'core/array';
import { characterCTLimit, gridSize } from 'data/game-config';

import Order from 'engine/order';
import Position from 'engine/position';
import Character from 'engine/character';
import GameStep from 'engine/game-step';
import Player, { IPlayerData } from 'engine/player';

interface IEngine {
	readonly players: IPlayerData[];
}

class Engine {
	private step: GameStep|null = null;
	private order: Order;
	private players: Player[] = [];
	private characters: Character[] = [];
	private actors: Character[] = [];

	constructor(conf: IEngine) {
		this.players = this.getPlayers(conf.players);
		this.characters = this.players.map(pl => pl.getCharacters()).reduce((a, b) => a.concat(b));
		this.order = new Order(this.players);

		// init engine
		this.cycle();
	}

	// start new game step
	private cycle() {
		if (null !== this.step) {
			throw new Error('Could not start new step if another is in progress');
		}
		const { characters, order } = this;

		// update characters
		characters.forEach(char => char.update());

		// update order
		order.update();

		// get actors
		const actors = characters.filter(char => {
			return char.getAttribute('CT') >= characterCTLimit || !char.isDead();
		});

		// if no actor present, continue updating characters
		if (!actors.length) {
			this.cycle();
			return;
		}
		// order actor
		this.actors = order.get().filter(char => -1 !== actors.indexOf(char));

		// start actor turns
		this.startStep();
	}

	private startStep() {
		const { actors, characters, order } = this;
		const actor = actors[0];
		this.actors.shift();

		if (!actor) {
			// start new cycle
			this.cycle();
			return;
		}

		// create new game step
		this.step = new GameStep(actor, characters, () => {
			// on step end run step for other actors
			this.step = null;
			order.update();
			this.startStep();
		});
	}

	private getPlayers(playerData: IPlayerData[]): Player[] {
		if (2 !== playerData.length) {
			throw new Error('Game has to have exactly two players');
		}
		const players = playerData.map((data, p) => {
			const player = new Player(data);

			player.getCharacters().forEach((char, i) => {
				// set position / orientation
				switch (p) {
					case 0:
						char.setPosition(new Position(i + 2, gridSize - 1));
						char.setDirection('TOP');
					case 1:
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
}

export default Engine;
