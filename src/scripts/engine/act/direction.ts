import Logger from 'engine/logger';
import Position from 'engine/position';
import Direction from 'engine/direction';
import Character from 'engine/character';

interface IActDirectEvents {
	onStart: (direct: ActDirect) => void;
	onSelect: (direct: ActDirect) => void;
}

export type ActDirectState = 'INIT' | 'IDLE' | 'DONE';

class ActDirect {
	private readonly actor: Character;
	private readonly events: IActDirectEvents;

	private state: ActDirectState = 'INIT';
	private targets: Position[] = []; // positions character can be directed to
	private target: Position|null = null; // position character is directed to

	constructor(actor: Character, events: IActDirectEvents) {
		this.actor = actor;
		this.events = this.prepareEvents(events);
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

		const pos = actor.position;
		const dir = actor.direction;

		this.targets = pos.getSideTiles(), // directable positions
		this.target = Direction.findPositionFrom(pos, dir); // set initial direction

		this.events.onStart(this);
	}

	public select(position: Position) {
		const { state, actor, targets } = this;

		if ('IDLE' !== state) {
			throw new Error('Could not select direct target: invalid state ' + state);
		}

		if (!position.isContained(targets)) {
			// non-directable position selected
			return;
		}
		this.state = 'DONE';

		const pos = actor.position;
		this.target = position;

		// update character direction
		const newDirection = Direction.resolve(pos, this.target);
		actor.direction = newDirection;

		this.events.onSelect(this);
	}

	private prepareEvents(events: IActDirectEvents): IActDirectEvents {
		return {
			onStart: direct => {
				Logger.log('ActDirect onStart');
				events.onStart(direct);
			},
			onSelect: direct => {
				const tgt = direct.target;
				Logger.log(`ActDirect onSelect: "${tgt ? `(${tgt.x}, ${tgt.y})` : '-'}"`);
				events.onSelect(direct);
			}
		};
	}
}

export default ActDirect;
