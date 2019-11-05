import { getUniqueItems } from 'core/array';
import { suddenDeathStart, suddenDeathInterval, gridSize } from 'data/game-config';

import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import { IBattleInfo } from 'modules/battle/battle-info';
import TileAnimation from 'modules/battle/act/tile-animation';
import { getTile, destroyTile } from 'modules/geometry/tiles';

const maxStep = gridSize - 1;

type OnUpdate = () => void;
type OnInfo = (info: IBattleInfo) => void;
type SuddenDeathCallback = (timeup: boolean) => void;

export interface ISuddenDeathSnapshot {
	readonly animation: TileAnimation | null;
	readonly highlightedTiles: Tile[];
}

class SuddenDeath {
	public animation: TileAnimation | null = null;

	private readonly onInfo: OnInfo;
	private readonly onUpdate: OnUpdate;
	private readonly characters: Character[];

	private highlighted: Tile[] = [];
	private running = false;
	private startTick = 0;
	private step = 0;

	constructor(characters: Character[], onUpdate: OnUpdate, onInfo: OnInfo) {
		this.onInfo = onInfo;
		this.onUpdate = onUpdate;
		this.characters = characters;
	}

	public serialize(): ISuddenDeathSnapshot {
		return {
			animation: this.animation,
			highlightedTiles: [...this.highlighted]
		};
	}

	public update(tick: number, cb: SuddenDeathCallback): void {
		if (tick < suddenDeathStart) {
			// wait for start
			cb(false);
			return;
		}

		if (tick === suddenDeathStart) {
			// start sudden death mode
			this.start(tick, cb);
			return;
		}
		const { startTick, step } = this;

		if (0 === (tick - startTick) % suddenDeathInterval) {
			// destroy highlighted tiles
			Logger.info(`SUDDEN DEATH: step ${step + 1}/${maxStep}`);

			this.destroy(() => {
				this.step++;

				if (this.step >= maxStep) {
					Logger.info('SUDDEN DEATH: ended');
					cb(true);
	
				} else {
					// highlight next tile ring
					this.highlight(cb);
				}
			});

			return;
		}

		// wait for another interval
		cb(false);
	}

	private start(tick: number, cb: SuddenDeathCallback): void {
		if (this.running) {
			throw new Error('Sudden death mode already started!');
		}
		this.startTick = tick;
		Logger.info('SUDDEN DEATH: started');

		this.highlight(cb);
	}

	// destroy highlighted tiles
	private destroy(cb: () => void): void {
		for (const tile of this.highlighted) {
			const character = this.characters.find(char => tile === char.position);

			if (character && !character.isDead()) {
				character.die();

				this.onInfo({
					text: 'Dead',
					type: 'DEBUFF',
					status: 'DYING',
					position: tile
				});
			}
			destroyTile(tile);
		}

		// animate destruction
		if (this.animation) {
			this.animation.stop();
		}
		this.animation = new TileAnimation('DESTROY', this.highlighted, isLast => {
			this.onUpdate();

			if (isLast) {
				this.animation = null;
				cb();
			}
		});

		this.animation.start();
	}

	private highlight(cb: SuddenDeathCallback): void {
		const { step } = this;

		if (step >= maxStep) {
			throw new Error('SuddenDeath could not highlight tile ring on step: ' + step);
		}
		const center = getTile(0, 0, 0);

		if (!center) {
			throw new Error('Tiles does not include center tile');
		}
		let ring: Tile[] = [center];
		let inner: Tile[] = [];

		// highlight tiles to be destroyed
		for (let i = 0; i < maxStep - step; i++) {
			let neighbours: Tile[] = [];

			for (const tile of ring) {
				neighbours = [...neighbours, ...tile.getNeighbours()];
			}
			neighbours = getUniqueItems(neighbours);
			neighbours = neighbours.filter(tile => !tile.isContained(inner) && !tile.isContained(ring));

			inner = [...inner, ...ring];
			ring = neighbours;
		}
		this.highlighted = ring;

		// animate highlight
		if (this.animation) {
			this.animation.stop();
		}
		this.animation = new TileAnimation('HIGHLIGHT', this.highlighted, isLast => {
			this.onUpdate();

			if (isLast) {
				this.animation = null;
				cb(false);
			}
		});

		this.animation.start();
	}
}

export default SuddenDeath;
