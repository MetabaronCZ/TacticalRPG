import Animation, { IAnimationStep } from 'core/animation';
import { gridSize, moveAnimDuration } from 'data/game-config';

import Position from 'engine/position';
import Direction from 'engine/direction';
import Character from 'engine/character';
import { getMovableTiles, getShortestPath, ICostMap } from 'engine/pathfinding';

export type ActMoveState = 'INIT' | 'IDLE' | 'ANIMATION' | 'DONE';

class ActMove {
	private readonly actor: Character;
	private readonly initialAP: number;
	private readonly initialPosition: Position;
	private readonly obstacles: Position[] = [];
	private state: ActMoveState = 'INIT';

	private area: Position[] = []; // movable tiles
	private target: Position; // target position
	private path: Position[] = []; // move path
	private costMap: ICostMap = {}; // movable area cost map

	constructor(actor: Character, characters: Character[]) {
		this.actor = actor;
		this.initialAP = actor.getAttribute('AP');
		this.initialPosition = actor.getPosition();
		this.obstacles = characters.filter(char => char !== actor).map(char => char.getPosition());
		this.target = this.initialPosition;
		this.init();
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

	public selectTarget(target: Position, cb: (step: IAnimationStep) => void): Animation|null {
		const { state, actor, obstacles, area, costMap } = this;

		if ('IDLE' !== state) {
			return null;
		}

		if (!target.isContained(area)) {
			// non-movable position selected
			return null;
		}
		const obst = obstacles.slice(0);

		// add non-moveArea positions in obstacles
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				const pos = new Position(x, y);

				if (pos.isContained(area) || pos.isContained(obst)) {
					continue;
				}
				obst.push(pos);
			}
		}
		const path = getShortestPath(actor.getPosition(), target, obst);

		if (path.length < 2) {
			// no possible movement path
			return null;
		}
		this.state = 'ANIMATION';
		this.target = target;
		this.path = path;

		const timing = Array(path.length).fill(moveAnimDuration);

		return new Animation(timing, step => {
			const tile = path[step.number];
			const dir = Direction.resolve(actor.getPosition(), tile);

			// update actor
			actor.setPosition(tile);
			actor.setDirection(dir);
			actor.setAttribute('AP', this.initialAP - costMap[tile.getId()]);

			if (step.isLast) {
				this.state = 'IDLE';
			}
			cb(step);
		});
	}

	public reset() {
		const { state, actor } = this;

		if ('IDLE' !== state) {
			throw new Error('Could not reset position: invalid state ' + state);
		}
		actor.setPosition(this.initialPosition);
		actor.setAttribute('AP', this.initialAP);
	}

	private init() {
		const { state, actor, obstacles } = this;

		if ('INIT' !== state) {
			throw new Error('Could not init movement: invalid state ' + state);
		}
		this.state = 'IDLE';

		const MOV = actor.getAttribute('MOV');
		const AP = actor.getAttribute('AP');
		const pos = actor.getPosition();

		const range = Math.min(MOV, AP);
		const movable = getMovableTiles(pos, obstacles, range);

		this.area = movable.positions;
		this.costMap = movable.costMap;
	}
}

export default ActMove;
