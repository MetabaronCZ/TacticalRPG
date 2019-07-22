import Animation from 'core/animation';
import { moveAnimDuration } from 'data/game-config';

import { formatTile } from 'modules/format';
import { getTiles } from 'modules/geometry/tiles';
import { resolveDirection } from 'modules/geometry/direction';
import { ICostMap, getMovableTiles, getShortestPath } from 'modules/pathfinding';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import Command from 'modules/battle/command';
import ActPhase from 'modules/battle/act/phase';
import { IOnActPhaseEvent } from 'modules/battle/act';

type Phase = 'SUSPENDED' | 'IDLE' | 'SELECTED' | 'ANIMATION';

export type MovePhaseEvents =
	'MOVE_IDLE' |
	'MOVE_SELECTED' |
	'MOVE_ANIMATION' |
	'MOVE_SUSPENDED';

export interface IActMoveRecord {
	readonly initialPosition: string;
	readonly target: string;
}

class MovePhase extends ActPhase<IActMoveRecord> {
	private readonly actor: Character;
	private readonly costMap: ICostMap = {}; // movable area cost map
	private readonly obstacles: Tile[] = [];
	private readonly onEvent: IOnActPhaseEvent;

	private phase: Phase = 'SUSPENDED';
	private initialAP: number;
	private initialPosition: Tile;
	private movable: Tile[] = [];
	private moveTarget: Tile;
	private movePath: Tile[] = [];

	constructor(actor: Character, characters: Character[], onEvent: IOnActPhaseEvent) {
		super();

		const obstacles = characters
			.filter(char => char !== actor && !char.isDead())
			.map(char => char.position);

		const { MOV, AP } = actor.attributes;
		const pos = actor.position;

		this.actor = actor;
		this.onEvent = onEvent;
		this.initialAP = AP;
		this.initialPosition = pos;
		this.moveTarget = pos;

		if (actor.canMove()) {
			const range = Math.min(MOV, AP);
			const movable = getMovableTiles(pos, obstacles, range);

			this.movable = movable.tiles;
			this.costMap = movable.costMap;
		}

		// create barrier tiles for A* algorithm
		this.obstacles = getTiles().filter(tile => tile.isContained(obstacles) || !tile.isContained(this.movable));
	}

	public getActor(): Character {
		return this.actor;
	}

	public getPhase(): Phase {
		return this.phase;
	}

	public getMovable(): Tile[] {
		return [...this.movable];
	}

	public getMoveCostMap(): ICostMap {
		return this.costMap;
	}

	public getTarget(): Tile | null {
		return this.moveTarget;
	}

	public getPath(): Tile[] {
		return [...this.movePath];
	}

	public getInitialPosition(): Tile {
		return this.initialPosition;
	}

	public start() {
		const { phase } = this;

		if ('SUSPENDED' !== phase) {
			throw new Error('Could not start movement: invalid phase ' + phase);
		}
		this.phase = 'IDLE';
		this.onEvent('MOVE_IDLE');
	}

	public selectTile(tile: Tile) {
		const { phase, actor, movable, obstacles } = this;

		if ('IDLE' !== phase || !tile.isContained(movable) || !actor.canMove()) {
			return;
		}
		const path = getShortestPath(actor.position, tile, obstacles);

		if (path.length < 2) {
			return;
		}
		this.phase = 'SELECTED';

		this.moveTarget = tile;
		this.movePath = path;

		this.onEvent('MOVE_SELECTED', tile);
		this.animate();
	}

	public selectCommand(command: Command) {
		if ('IDLE' === this.phase) {
			this.phase = 'SUSPENDED';
			this.onEvent('MOVE_SUSPENDED', command);
		}
	}

	public serialize(): IActMoveRecord {
		return {
			initialPosition: formatTile(this.initialPosition),
			target: formatTile(this.moveTarget)
		};
	}

	private animate() {
		const { actor, phase, movePath, costMap } = this;

		if ('SELECTED' !== phase) {
			throw new Error('Could not animate movement: invalid phase ' + phase);
		}
		this.phase = 'ANIMATION';

		const timing = Array(movePath.length).fill(moveAnimDuration);

		const anim = new Animation(timing, step => {
			const newPos = movePath[step.number];
			const newDir = resolveDirection(actor.position, newPos);

			// update actor
			actor.position = newPos;
			actor.direction = newDir;
			actor.attributes.set('AP', this.initialAP - costMap[newPos.id]);

			this.onEvent('MOVE_ANIMATION');

			if (step.isLast) {
				this.phase = 'IDLE';
				this.onEvent('MOVE_IDLE');
			}
		});

		anim.start();
	}
}

export default MovePhase;
