import Sequence from 'core/sequence';

import { getTiles } from 'modules/geometry/tiles';
import { resolveDirection } from 'modules/geometry/direction';
import { ICostMap, getMovableTiles, getShortestPath } from 'modules/pathfinding';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import Command from 'modules/battle/command';
import ActPhase from 'modules/battle/act/phase';
import { IOnActPhaseEvent } from 'modules/battle/act';
import MoveAnimation from 'modules/battle/act/move-animation';

const txtIdle = 'Move on grid or select a command:';
const txtMoving = 'Moving ...';

export type MovePhaseID = 'SUSPENDED' | 'IDLE' | 'SELECTED' | 'ANIMATION';

export type MovePhaseEvents =
	'MOVE_IDLE' |
	'MOVE_SELECTED' |
	'MOVE_ANIMATION' |
	'MOVE_SUSPENDED';

export interface IMovePhaseSnapshot {
	readonly phase: MovePhaseID;
	readonly initialAP: number;
	readonly initialPosition: Tile;
	readonly movable: Tile[];
	readonly moveTarget: Tile;
	readonly movePath: Tile[];
	readonly costMap: ICostMap;
}

export interface IMovePhaseRecord {
	readonly initialPosition: string;
	readonly target: string;
}

class MovePhase extends ActPhase<IMovePhaseSnapshot, IMovePhaseRecord> {
	public readonly actor: Character;

	private readonly costMap: ICostMap = {}; // movable area cost map
	private readonly obstacles: Tile[] = [];
	private readonly onEvent: IOnActPhaseEvent;

	private phase: MovePhaseID = 'SUSPENDED';
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

	public start(): void {
		const { phase } = this;

		if ('SUSPENDED' !== phase) {
			throw new Error('Could not start movement: invalid phase ' + phase);
		}
		this.phase = 'IDLE';
		this.info = txtIdle;

		this.onEvent('MOVE_IDLE');
	}

	public selectTile(tile: Tile): void {
		const { phase, actor, movable, obstacles } = this;
		const actorPos = actor.position;

		if ('IDLE' !== phase || !tile.isContained(movable) || !actor.canMove()) {
			return;
		}
		this.phase = 'SELECTED';

		if (tile === actorPos) {
			this.finalize();
			return;
		}
		this.moveTarget = tile;
		this.movePath = getShortestPath(actorPos, tile, obstacles);

		this.onEvent('MOVE_SELECTED', tile);
		this.animate();
	}

	public selectCommand(command: Command): void {
		if ('IDLE' === this.phase) {
			this.phase = 'SUSPENDED';
			this.info = '';

			this.onEvent('MOVE_SUSPENDED', command);
		}
	}

	public serialize(): IMovePhaseSnapshot {
		return {
			phase: this.phase,
			initialAP: this.initialAP,
			initialPosition: this.initialPosition,
			movable: [...this.movable],
			moveTarget: this.moveTarget,
			movePath: [...this.movePath],
			costMap: { ...this.costMap }
		};
	}

	public getRecord(): IMovePhaseRecord {
		const state = this.serialize();
		return {
			initialPosition: state.initialPosition.id,
			target: state.moveTarget.id
		};
	}

	private animate(): void {
		const { actor, phase, movePath, costMap } = this;

		if ('SELECTED' !== phase) {
			throw new Error('Could not animate movement: invalid phase ' + phase);
		}
		this.phase = 'ANIMATION';

		if (!movePath.length) {
			// current position selected
			this.finalize();
			return;
		}
		this.info = txtMoving;

		const timing = Array(movePath.length).fill(0);

		const moveSequence = new Sequence(
			timing,
			true,
			(step, next) => {
				// set direction to new tile
				const newPos = movePath[step.number];
				const cost = costMap[newPos.id];

				if (movePath.length > 1) {
					actor.direction = resolveDirection(actor.position, newPos);
				}

				// animate tile-tile movement
				const moveAnim = new MoveAnimation(
					actor,
					newPos,
					isLast => {
						this.onEvent('MOVE_ANIMATION');

						if (isLast) {
							actor.attributes.set('AP', this.initialAP - cost);
							next();
						}
					}
				);

				moveAnim.start();
			},
			() => {
				// on sequence end
				this.finalize();
			}
		);

		moveSequence.start();
	}

	private finalize(): void {
		this.phase = 'SUSPENDED';
		this.start();
	}
}

export default MovePhase;
