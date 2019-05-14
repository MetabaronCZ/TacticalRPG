import Animation, { IAnimationStep } from 'core/animation';
import { gridSize, moveAnimDuration } from 'data/game-config';

import { formatTile } from 'modules/format';
import { getTile } from 'modules/geometry/tiles';
import { resolveDirection } from 'modules/geometry/direction';
import { getMovableTiles, getShortestPath, ICostMap } from 'modules/pathfinding';

import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import Character from 'modules/character';

interface IActMoveEvents {
	onStart: (move: ActMove) => void;
	onSelect: (move: ActMove) => void;
	onAnimation: (move: ActMove, step: IAnimationStep) => void;
	onEnd: (move: ActMove) => void;
}

export interface IActMoveRecord {
	readonly initialPosition: string;
	readonly target: string;
}

export type ActMoveState = 'INIT' | 'IDLE' | 'SELECTED' | 'ANIMATION';

class ActMove {
	private readonly actor: Character;
	private readonly obstacles: Tile[] = [];
	private readonly events: IActMoveEvents;

	private state: ActMoveState = 'INIT';
	private area: Tile[] = []; // movable tiles
	private target: Tile; // target tile
	private path: Tile[] = []; // move path
	private costMap: ICostMap = {}; // movable area cost map
	private initialAP: number;
	private initialPosition: Tile;

	constructor(actor: Character, characters: Character[], events: IActMoveEvents) {
		this.actor = actor;
		this.initialAP = actor.attributes.AP;
		this.initialPosition = actor.position;

		this.obstacles = characters
			.filter(char => char !== actor && !char.isDead())
			.map(char => char.position);

		this.target = this.initialPosition;
		this.events = this.prepareEvents(events);
	}

	public getState(): ActMoveState {
		return this.state;
	}

	public getMovable(): Tile[] {
		return this.area;
	}

	public getMoveCostMap(): ICostMap {
		return this.costMap;
	}

	public getTarget(): Tile | null {
		return this.target;
	}

	public getPath(): Tile[] {
		return this.path;
	}

	public getInitialPosition(): Tile {
		return this.initialPosition;
	}

	public start() {
		const { state, actor, obstacles } = this;

		if ('INIT' !== state) {
			throw new Error('Could not init movement: invalid state ' + state);
		}
		this.state = 'IDLE';

		const { MOV, AP } = actor.attributes;
		const pos = actor.position;

		const range = Math.min(MOV, AP);
		const movable = getMovableTiles(pos, obstacles, range);

		this.area = movable.tiles;
		this.costMap = movable.costMap;
		this.initialAP = actor.attributes.AP;
		this.initialPosition = pos;
		this.target = pos;

		this.events.onStart(this);
	}

	public selectTarget(target: Tile) {
		const { state, actor, obstacles, area } = this;

		if ('IDLE' !== state || !target.isContained(area) || !actor.canMove()) {
			return;
		}
		const obst = obstacles.slice(0);

		// add non-moveArea positions in obstacles
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				const pos = getTile(x, y);

				if (null === pos || pos.isContained(area) || pos.isContained(obst)) {
					continue;
				}
				obst.push(pos);
			}
		}
		const path = getShortestPath(actor.position, target, obst);

		if (path.length < 2) {
			return;
		}
		this.state = 'SELECTED';
		this.target = target;
		this.path = path;

		this.events.onSelect(this);

		this.animate();
	}

	public serialize(): IActMoveRecord {
		return {
			initialPosition: formatTile(this.initialPosition),
			target: formatTile(this.target)
		};
	}

	private animate() {
		const { state, actor, path, costMap, events } = this;

		if ('SELECTED' !== state) {
			throw new Error('Could not animate movement: invalid state ' + state);
		}
		this.state = 'ANIMATION';

		const timing = Array(path.length).fill(moveAnimDuration);

		const anim = new Animation(timing, step => {
			const tile = path[step.number];
			const dir = resolveDirection(actor.position, tile);

			// update actor
			actor.position = tile;
			actor.direction = dir;
			actor.attributes.set('AP', this.initialAP - costMap[tile.id]);

			events.onAnimation(this, step);

			if (step.isLast) {
				this.state = 'IDLE';
				events.onEnd(this);
			}
		});

		anim.start();
	}

	private prepareEvents(events: IActMoveEvents): IActMoveEvents {
		return {
			onStart: move => {
				Logger.info(`ActMove onStart: ${formatTile(move.initialPosition)}`);
				events.onStart(move);
			},
			onSelect: move => {
				Logger.info(`ActMove onSelect: ${formatTile(move.target)}`);
				events.onSelect(move);
			},
			onAnimation: events.onAnimation,
			onEnd: move => {
				Logger.info('ActMove onEnd');
				events.onEnd(move);
			}
		};
	}
}

export default ActMove;
