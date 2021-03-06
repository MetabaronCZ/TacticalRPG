import { findTileFrom, resolveDirection } from 'modules/geometry/direction';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import ActPhase from 'modules/battle/act/phase';
import { OnActPhaseEvent } from 'modules/battle/act';

const txtIdle = 'Select new direction on grid.';

export interface IDirectPhaseSnapshot {
	readonly phase: DirectionPhaseID;
	readonly directable: Tile[];
	readonly target: Tile | null;
}

export interface IDirectPhaseRecord {
	readonly target: string | null;
}

export type DirectionPhaseID = 'SUSPENDED' | 'IDLE';

export type DirectPhaseEvents =
	'DIRECTION_IDLE' |
	'DIRECTION_SELECTED';

class DirectPhase extends ActPhase<IDirectPhaseSnapshot, IDirectPhaseRecord> {
	public readonly actor: Character;

	private phase: DirectionPhaseID = 'SUSPENDED';
	private directable: Tile[] = [];
	private directTarget: Tile | null = null;

	private readonly onEvent: OnActPhaseEvent;

	constructor(actor: Character, characters: Character[], onEvent: OnActPhaseEvent) {
		super();
		this.actor = actor;
		this.onEvent = onEvent;
	}

	public start(): void {
		const { actor, phase } = this;

		if ('SUSPENDED' !== phase) {
			throw new Error('Could not start direction phase: invalid phase ' + phase);
		}
		this.phase = 'IDLE';

		const pos = actor.position;
		const dir = actor.direction;

		this.directable = pos.getNeighbours(),
		this.directTarget = findTileFrom(pos, dir);

		if (!actor.canAct()) {
			// skip direction selection
			this.selectTile(this.directTarget);

		} else {
			// let user select new direction
			this.info = txtIdle;
			this.onEvent('DIRECTION_IDLE');
		}
	}

	public selectTile(tile: Tile | null): void {
		const { actor, phase, directable } = this;

		if ('IDLE' !== phase) {
			return;
		}
		if (tile) {
			// select direct target
			if (!tile.isContained(directable)) {
				return;
			}
			this.directTarget = tile;

			// update character
			const newDir = resolveDirection(actor.position, tile);
			actor.direction = newDir;
		}
		this.info = '';

		this.onEvent('DIRECTION_SELECTED', tile);
	}

	public selectCommand(): void {
		// do nothing
	}

	public serialize(): IDirectPhaseSnapshot {
		return {
			phase: this.phase,
			directable: [...this.directable],
			target: this.directTarget
		};
	}

	public getRecord(): IDirectPhaseRecord {
		const tgt = this.directTarget;
		return {
			target: (tgt ? tgt.id : null)
		};
	}
}

export default DirectPhase;
