import { moveAnimDuration } from 'data/game-config';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';

type IOnDone = () => void;
type IOnUpdate = () => void;

class MoveAnimation {
	private readonly actor: Character;
	private readonly target: Tile;
	private readonly onDone: IOnDone;
	private readonly onUpdate: IOnUpdate;

	private done = false;
	private running = false;
	private startTime = 0;
	private startPosition: Tile;

	constructor(actor: Character, target: Tile, onUpdate: IOnUpdate, onDone: IOnDone) {
		this.actor = actor;
		this.target = target;
		this.startPosition = actor.position;

		this.onDone = onDone;
		this.onUpdate = onUpdate;
	}

	public start(): void {
		if (this.done) {
			return;
		}
		this.running = true;
		this.startTime = performance.now();

		this.move(this.startTime);
	}

	private move = (t: number): void => {
		if (!this.running) {
			return;
		}
		requestAnimationFrame(this.move);

		const { actor, target, startPosition } = this;
		const { x, y, z, h, terrain } = startPosition;

		const diff = t - this.startTime;
		const scale = Math.min(diff / moveAnimDuration, 1);
		const isLast = (1 === scale);

		const diffX = x + scale * (target.x - x);
		const diffY = y + scale * (target.y - y);
		const diffZ = z + scale * (target.z - z);

		if (!isLast) {
			actor.position = new Tile('-', diffX, diffY, diffZ, h, terrain);
		} else {
			actor.position = target;
		}
		this.onUpdate();

		if (isLast) {
			this.running = false;
			this.done = true;
			this.onDone();
		}
	}
}

export default MoveAnimation;
