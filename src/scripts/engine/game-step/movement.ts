import Animation, { IAnimationStep } from 'core/animation';
import { gridSize, moveAnimDuration } from 'data/game-config';

import Position from 'engine/position';
import Direction from 'engine/direction';
import Character from 'engine/character';
import CostMap from 'engine/pathfinding/cost-map';
import { getMovableTiles, getShortestPath } from 'engine/pathfinding';

export type MovePhaseState = 'INIT' | 'IDLE' | 'SELECTED' | 'ANIMATION';
export type IMoveCallback = (step: IAnimationStep) => void;

class GamePhaseMove {
	private readonly actor: Character;
	private readonly initialAP: number;
	private readonly initialPosition: Position;
	private readonly obstacles: Position[] = [];
	private state: MovePhaseState = 'INIT';

	private area: Position[] = []; // movable tiles
	private target: Position|null = null; // target position
	private path: Position[] = []; // move path
	private costMap = new CostMap(); // movable area cost map

	constructor(actor: Character, characters: Character[]) {
		this.actor = actor;
		this.initialAP = actor.getAttribute('AP');
		this.initialPosition = actor.getPosition();
		this.obstacles = characters.map(char => char.getPosition());
		this.init();
	}

	public getState(): MovePhaseState {
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

	public selectTarget(target: Position, cb: IMoveCallback) {
		const { state, actor, obstacles, area } = this;

		if ('IDLE' !== state) {
			throw new Error('Could not select move target: invalid state ' + state);
		}

		if (!target.isContained(area)) {
			// non-movable position selected
			return;
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

		if (!path.length) {
			// no possible movement path
			return;
		}
		this.state = 'SELECTED';
		this.target = target;
		this.path = path;

		this.animate(cb);
	}

	public resetPosition() {
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

	private animate(cb: IMoveCallback) {
		const { state, actor, path, costMap } = this;

		if ('SELECTED' !== state) {
			throw new Error('Could not animate movement: invalid state ' + state);
		}
		this.state = 'ANIMATION';

		const movePath = path.slice(1); // path without actor position
		const timing = Array(movePath.length).fill(moveAnimDuration);

		// animate movement
		const moveAnim = new Animation(timing, step => {
			const tile = movePath[step.number];
			const dir = Direction.resolve(actor.getPosition(), tile);

			// update actor
			actor.setPosition(tile);
			actor.setDirection(dir);
			actor.setAttribute('AP', this.initialAP - costMap.get(tile));

			if (step.isLast) {
				this.state = 'IDLE';
			}
			cb(step);
		});

		// start move animation
		moveAnim.start();
	}
}

export default GamePhaseMove;
