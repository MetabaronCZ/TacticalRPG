import Animation from 'core/animation';
import { moveAnimDuration } from 'data/game-config';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';

type OnUpdate = (isLast: boolean) => void;

class MoveAnimation extends Animation<null> {
	private readonly actor: Character;
	private readonly target: Tile;
	private readonly startPosition: Tile;

	constructor(actor: Character, target: Tile, onUpdate: OnUpdate) {
		super(null, moveAnimDuration, isLast => this.update(isLast, onUpdate));

		this.actor = actor;
		this.target = target;
		this.startPosition = actor.position;
	}

	private update(isLast: boolean, onUpdate: OnUpdate): void {
		const { actor, target, startPosition, progress } = this;
		const { x, y, z, h, terrain } = startPosition;

		const diffX = x + progress * (target.x - x);
		const diffY = y + progress * (target.y - y);
		const diffZ = z + progress * (target.z - z);

		if (!isLast) {
			actor.position = new Tile('-', diffX, diffY, diffZ, h, terrain);
		} else {
			actor.position = target;
		}
		onUpdate(isLast);
	}
}

export default MoveAnimation;
