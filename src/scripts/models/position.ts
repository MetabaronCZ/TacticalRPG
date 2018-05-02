import { gridSize } from 'models/game-config';
import { Direction } from 'models/direction';

export interface IPosition {
	x: number;
	y: number;
	id: string;
	cost: number;
}

export class Position {
	public static NULL_POSITION: IPosition = Position.create(-1, -1);

	public static create(x: number = 0, y: number = 0): IPosition {
		return {
			x,
			y,
			id: x + '|' + y,
			cost: 1
		};
	}

	public static isEqual(a?: IPosition, b?: IPosition) {
		return a && b && a.id === b.id;
	}

	public static isContained(pos: IPosition, arr: IPosition[] = []): boolean {
		for (const a of arr) {
			if (Position.isEqual(a, pos)) {
				return true;
			}
		}
		return false;
	}

	public static isOnStraightLine(pos: IPosition, ref: IPosition): boolean {
		return (pos.x === ref.x || pos.y === ref.y || 0 === (Math.abs(pos.x - ref.x) - Math.abs(pos.y - ref.y)));
	}

	public static getSideTiles(pos: IPosition, obstacles: IPosition[] = []): IPosition[] {
		const neighbours: IPosition[] = [];

		neighbours.push(Position.create(pos.x - 1, pos.y));
		neighbours.push(Position.create(pos.x + 1, pos.y));
		neighbours.push(Position.create(pos.x, pos.y - 1));
		neighbours.push(Position.create(pos.x, pos.y + 1));

		return neighbours.filter(n => {
			return Position.isInGrid(n) && !Position.isContained(n, obstacles);
		});
	}

	public static getNeighbours(pos: IPosition, obstacles: IPosition[] = []): IPosition[] {
		const neighbours: IPosition[] = [];

		for (let x = -1; x <= 1; x++) {
			for (let y = -1; y <= 1; y++) {
				if (!x && !y) {
					continue;
				}
				neighbours.push(Position.create(pos.x + x, pos.y + y));
			}
		}

		return neighbours.filter(n => {
			return Position.isInGrid(n) && !Position.isContained(n, obstacles);
		});
	}

	public static isInGrid(pos: IPosition): boolean {
		return pos.x >= 0 && pos.y >= 0 && pos.x < gridSize && pos.y < gridSize;
	}

	public static getByDirection(source: IPosition, dir: Direction) {
		let pos: IPosition;

		switch (dir) {
			case Direction.TOP:
				pos = Position.create(source.x, source.y - 1);
				break;

			case Direction.BOTTOM:
				pos = Position.create(source.x, source.y + 1);
				break;

			case Direction.LEFT:
				pos = Position.create(source.x - 1, source.y);
				break;

			case Direction.RIGHT:
				pos = Position.create(source.x + 1, source.y);
				break;

			default:
				throw new Error('Invalid direction');
		}

		if (!Position.isInGrid(pos)) {
			return;
		}
		return pos;
	}

	public static getDirection(source: IPosition, target: IPosition): Direction {
		const diffX = target.x - source.x;
		const diffY = target.y - source.y;
		const diffXMag = Math.abs(diffX);
		const diffYMag = Math.abs(diffY);

		if (diffXMag > diffYMag) {
			// horizontal direction
			if (diffX < 0) {
				return Direction.LEFT;
			} else {
				return Direction.RIGHT;
			}
		} else {
			// vertical direction
			if (diffY < 0) {
				return Direction.TOP;
			} else {
				return Direction.BOTTOM;
			}
		}
	}
}
