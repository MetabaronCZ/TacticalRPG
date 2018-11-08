import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import { resolveDirection, findTileFrom } from 'modules/geometry/direction';

interface IActDirectEvents {
	onStart: (direct: ActDirect) => void;
	onSelect: (direct: ActDirect) => void;
	onEnd: (direct: ActDirect) => void;
}

export type ActDirectState = 'INIT' | 'IDLE' | 'DONE';

class ActDirect {
	private readonly actor: Character;
	private readonly events: IActDirectEvents;

	private state: ActDirectState = 'INIT';
	private targets: Tile[] = []; // tiles character can be directed to
	private target: Tile|null = null; // tiles character is directed to

	constructor(actor: Character, events: IActDirectEvents) {
		this.actor = actor;
		this.events = this.prepareEvents(events);
	}

	public getState(): ActDirectState {
		return this.state;
	}

	public getDirectable(): Tile[] {
		return this.targets;
	}

	public getTarget(): Tile|null {
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

		this.targets = pos.getSideTiles(), // directable tiles
		this.target = findTileFrom(pos, dir); // set initial direction

		this.events.onStart(this);

		if (!actor.canAct()) {
			// force direction to end
			this.select(this.target);
		}
	}

	public select(tile: Tile|null) {
		const { state, actor, targets } = this;

		if ('IDLE' !== state) {
			throw new Error('Could not select direct target: invalid state ' + state);
		}

		if (tile && !tile.isContained(targets)) {
			// non-directable tile selected
			return;
		}
		this.state = 'DONE';

		if (tile) {
			const pos = actor.position;
			this.target = tile;

			// update character direction
			const newDirection = resolveDirection(pos, this.target);
			actor.direction = newDirection;
		}

		this.events.onSelect(this);
		this.events.onEnd(this);
	}

	private prepareEvents(events: IActDirectEvents): IActDirectEvents {
		return {
			onStart: direct => {
				Logger.info('ActDirect onStart');
				events.onStart(direct);
			},
			onSelect: direct => {
				const tgt = direct.target;
				Logger.info(`ActDirect onSelect: "${tgt ? `(${tgt.x}, ${tgt.y})` : '-'}"`);
				events.onSelect(direct);
			},
			onEnd: direct => {
				Logger.info('ActDirect onEnd');
				events.onEnd(direct);
			},
		};
	}
}

export default ActDirect;
