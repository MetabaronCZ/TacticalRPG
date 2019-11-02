import { getUniqueItems } from 'core/array';
import { suddenDeathStart, suddenDeathInterval, gridSize } from 'data/game-config';

import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import { getTiles, getTile } from 'modules/geometry/tiles';
import TileAnimation from 'modules/battle/act/tile-animation';

const tiles = getTiles();
const maxStep = gridSize - 1;

type OnUpdate = () => void;
type SuddenDeathCallback = (timeup: boolean) => void;

export interface ISuddenDeathSnapshot {
	readonly animation: TileAnimation | null;
	readonly highlightedTiles: Tile[];
	readonly destroyedTiles: Tile[];
}

class SuddenDeath {
	public animation: TileAnimation | null = null;

	private readonly center: Tile;
	private readonly onUpdate: OnUpdate;

	private highlighted: Tile[] = [];
	private destroyed: Tile[] = [];
	private running = false;
	private startTick = 0;
	private step = 0;

	constructor(onUpdate: OnUpdate) {
		const center = getTile(0, 0, 0);

		if (!center) {
			throw new Error('Tiles does not include center');
		}
		this.center = center;
		this.onUpdate = onUpdate;
	}

	public serialize(): ISuddenDeathSnapshot {
		return {
			animation: this.animation,
			highlightedTiles: [...this.highlighted],
			destroyedTiles: [...this.destroyed]
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
			this.destroy();

			this.step++;

			if (this.step >= maxStep) {
				Logger.info('SUDDEN DEATH: ended');
				cb(true);

			} else {
				// highlight next tile ring
				this.highlight(cb);
			}
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

	private destroy(): void {
		// destroy highlighted tiles
		// TODO
	}

	private highlight(cb: SuddenDeathCallback): void {
		const { step, center } = this;

		if (step >= maxStep) {
			throw new Error('SuddenDeath could not highlight tile ring on step: ' + step);
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
		this.destroyed = tiles.filter(tile => !tile.isContained(inner) && !tile.isContained(ring));

		// animate highlight
		if (this.animation) {
			this.animation.stop();
		}
		this.animation = new TileAnimation(
			'HIGHLIGHT',
			this.highlighted,
			() => this.onUpdate(),
			() => {
				this.animation = null;
				cb(false);
			}
		);

		this.animation.start();
	}
}

export default SuddenDeath;
