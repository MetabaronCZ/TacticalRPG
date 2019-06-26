import { formatTile } from 'modules/format';
import { findTileFrom, resolveDirection } from 'modules/geometry/direction';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import ActPhase from 'modules/battle/act/phase';
import { IOnActPhaseEvent } from 'modules/battle/act';
import CharacterAction from 'modules/battle/character-action';

export interface IActDirectRecord {
	readonly target: string | null;
}

type Phase = 'SUSPENDED' | 'IDLE';

export type DirectPhaseEvents =
	'DIRECTION_IDLE' |
	'DIRECTION_SELECTED';

class DirectPhase extends ActPhase<IActDirectRecord> {
	private readonly actor: Character;
	private readonly onEvent: IOnActPhaseEvent;

	private phase: Phase = 'SUSPENDED';
	private directable: Tile[] = [];
	private directTarget: Tile | null = null;

	constructor(actor: Character, characters: Character[], onEvent: IOnActPhaseEvent) {
		super();
		this.actor = actor;
		this.onEvent = onEvent;
	}

	public getPhase(): Phase {
		return this.phase;
	}

	public getDirectable(): Tile[] {
		return this.directable;
	}

	public getTarget(): Tile | null {
		return this.directTarget;
	}

	public start() {
		const { actor, phase } = this;

		if ('SUSPENDED' !== phase) {
			throw new Error('Could not start direction phase: invalid phase ' + phase);
		}
		this.phase = 'IDLE';

		const pos = actor.position;
		const dir = actor.direction;

		this.directable = pos.getSideTiles(),
		this.directTarget = findTileFrom(pos, dir);

		if (!actor.canAct()) {
			// skip direction selection
			this.selectTile(this.directTarget);
		} else {
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
		this.onEvent('DIRECTION_SELECTED', tile);
	}

	public selectAction(action: CharacterAction) {
		// do nothing
	}

	public serialize(): IActDirectRecord {
		const tgt = this.directTarget;
		return {
			target: (tgt ? formatTile(tgt) : null)
		};
	}
}

export default DirectPhase;
