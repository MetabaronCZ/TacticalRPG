import Animation, { IAnimationStep } from 'core/animation';
import { gridSize, moveAnimDuration } from 'data/game-config';

import Logger from 'modules/logger';
import Character from 'modules/character';
import Position from 'modules/geometry/position';
import { getPosition } from 'modules/geometry/positions';
import { resolveDirection } from 'modules/geometry/direction';
import { getMovableTiles, getShortestPath, ICostMap } from 'modules/pathfinding';
import { formatPosition } from 'ui/utils';

interface IActMoveEvents {
	onStart: (move: ActMove) => void;
	onSelect: (move: ActMove) => void;
	onAnimation: (move: ActMove, step: IAnimationStep) => void;
	onEnd: (move: ActMove) => void;
}

export type ActMoveState = 'INIT' | 'IDLE' | 'SELECTED' | 'ANIMATION';

class ActMove {
	private readonly actor: Character;
	private readonly initialAP: number;
	private readonly initialPosition: Position;
	private readonly obstacles: Position[] = [];
	private readonly events: IActMoveEvents;

	private state: ActMoveState = 'INIT';
	private area: Position[] = []; // movable tiles
	private target: Position; // target position
	private path: Position[] = []; // move path
	private costMap: ICostMap = {}; // movable area cost map

	constructor(actor: Character, characters: Character[], events: IActMoveEvents) {
		this.actor = actor;
		this.initialAP = actor.attributes.AP;
		this.initialPosition = actor.position;
		this.obstacles = characters.filter(char => char !== actor).map(char => char.position);
		this.target = this.initialPosition;
		this.events = this.prepareEvents(events);
	}

	public getState(): ActMoveState {
		return this.state;
	}

	public getMovable(): Position[] {
		return this.area;
	}

	public getTarget(): Position|null {
		return this.target;
	}

	public getPath(): Position[] {
		return this.path;
	}

	public getInitialPosition(): Position {
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

		this.area = movable.positions;
		this.costMap = movable.costMap;

		this.events.onStart(this);
	}

	public selectTarget(target: Position) {
		const { state, actor, obstacles, area } = this;

		if ('IDLE' !== state || !target.isContained(area) || !actor.canMove()) {
			return;
		}
		const obst = obstacles.slice(0);

		// add non-moveArea positions in obstacles
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				const pos = getPosition(x, y);

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
				Logger.info(`ActMove onStart: ${formatPosition(move.initialPosition)}`);
				events.onStart(move);
			},
			onSelect: move => {
				Logger.info(`ActMove onSelect: ${formatPosition(move.target)}`);
				events.onSelect(move);
			},
			onAnimation: (move, step) => {
				Logger.info(`ActMove onAnimation (${step.number + 1}/${step.max}): ${formatPosition(move.actor.position)}`);
				events.onAnimation(move, step);
			},
			onEnd: move => {
				Logger.info('ActMove onEnd');
				events.onEnd(move);
			}
		};
	}
}

export default ActMove;
