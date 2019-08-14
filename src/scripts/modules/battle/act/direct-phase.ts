import { formatTile } from 'modules/format';
import { findTileFrom, resolveDirection } from 'modules/geometry/direction';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import Command from 'modules/battle/command';
import ActPhase from 'modules/battle/act/phase';
import { IOnActPhaseEvent } from 'modules/battle/act';

const txtIdle = 'Select new direction on grid.';

export interface IDirectPhaseState {
	readonly phase: Phase;
	readonly directable: Tile[];
	readonly target: Tile | null;
}

export interface IDirectPhaseRecord {
	readonly target: string | null;
}

type Phase = 'SUSPENDED' | 'IDLE';

export type DirectPhaseEvents =
	'DIRECTION_IDLE' |
	'DIRECTION_SELECTED';

class DirectPhase extends ActPhase<IDirectPhaseState, IDirectPhaseRecord> {
	public readonly actor: Character;

	private phase: Phase = 'SUSPENDED';
	private directable: Tile[] = [];
	private directTarget: Tile | null = null;

	private readonly onEvent: IOnActPhaseEvent;

	constructor(actor: Character, characters: Character[], onEvent: IOnActPhaseEvent) {
		super();
		this.actor = actor;
		this.onEvent = onEvent;
	}

	public start() {
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

	public selectTile(tile: Tile | null) {
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
			const pos = actor.position;
			const newDir = resolveDirection(pos, tile);
			actor.direction = newDir;
		}
		this.info = '';

		this.onEvent('DIRECTION_SELECTED', tile);
	}

	public selectCommand(command: Command) {
		// do nothing
	}

	public getState(): IDirectPhaseState {
		return {
			phase: this.phase,
			directable: [...this.directable],
			target: this.directTarget
		};
	}

	public getRecord(): IDirectPhaseRecord {
		const tgt = this.directTarget;
		return {
			target: (tgt ? formatTile(tgt) : null)
		};
	}
}

export default DirectPhase;
