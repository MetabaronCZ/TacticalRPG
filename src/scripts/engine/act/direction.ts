import Position from 'engine/position';
import Direction from 'engine/direction';
import Character from 'engine/character';

export type ActDirectState = 'INIT' | 'IDLE';

class ActDirect {
	private readonly actor: Character;
	private state: ActDirectState = 'INIT';

	private targets: Position[] = []; // positions character can be directed to
	private target: Position|null = null; // position character is directed to

	constructor(actor: Character) {
		this.actor = actor;
	}

	public getState(): ActDirectState {
		return this.state;
	}

	public getDirectable(): Position[] {
		return this.targets;
	}

	public getTarget(): Position|null {
		return this.target;
	}

	public start() {
		const { state, actor } = this;

		if ('INIT' !== state) {
			throw new Error('Could not start direct: invalid state ' + state);
		}
		this.state = 'IDLE';

		const pos = actor.getPosition();
		const dir = actor.getDirection();

		this.targets = pos.getSideTiles(), // directable positions
		this.target = Direction.findPositionFrom(pos, dir); // set initial direction
	}

	public select(position: Position, cb: () => void) {
		const { state, actor, targets } = this;

		if ('IDLE' !== state) {
			throw new Error('Could not select direct target: invalid state ' + state);
		}

		if (!position.isContained(targets)) {
			// non-directable position selected
			return;
		}
		const pos = actor.getPosition();
		this.target = position;

		// update character direction
		const newDirection = Direction.resolve(pos, this.target);
		actor.setDirection(newDirection);

		cb();
	}
}

export default ActDirect;
