import { tileAnimationDuration } from 'data/game-config';
import Tile from 'modules/geometry/tile';

type TileAnimationType = 'HIGHLIGHT' | 'DESTROY';

type OnUpdate = () => void;
type OnEnd = () => void;

class TileAnimation {
	public readonly type: TileAnimationType;
	public readonly tiles: Tile[];

	private readonly duration: number;

	private readonly onEnd: OnEnd;
	private readonly onUpdate: OnUpdate;

	private done = false;
	private running = false;
	private startTime = 0;
	private progress = 0;

	constructor(type: TileAnimationType, tiles: Tile[], onUpdate: OnUpdate, onEnd: OnEnd) {
		this.type = type;
		this.tiles = tiles;
		this.duration = tileAnimationDuration;

		this.onEnd = onEnd;
		this.onUpdate = onUpdate;
	}

	public isRunning(): boolean {
		return this.running;
	}

	public getProgress(): number {
		return this.progress;
	}

	public start(): void {
		if (this.done || this.running) {
			throw new Error('Tile animation already started!');
		}
		this.running = true;
		this.startTime = performance.now();

		this.animate(this.startTime);
	}

	public stop(): void {
		this.running = false;
		this.done = true;
	}

	private animate = (t: number): void => {
		if (this.done || !this.running) {
			return;
		}
		requestAnimationFrame(this.animate);

		const diff = Math.max(t - this.startTime, 0);
		const progress = Math.min(diff / this.duration, 1);
		const isLast = (1 === progress);

		this.progress = progress;
		this.onUpdate();

		if (isLast) {
			this.stop();
			this.onEnd();
		}
	}
}

export default TileAnimation;
