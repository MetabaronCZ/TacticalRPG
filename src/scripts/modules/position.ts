import { gridSize } from 'modules/game-config';
import { Direction } from 'modules/direction';

export interface IPosition {
	x: number;
	y: number;
	id: string;
	cost: number;
}

const create = (x: number = 0, y: number = 0): IPosition => {
	return {
		x,
		y,
		id: x + '|' + y,
		cost: 1
	};
};

const isEqual = (a?: IPosition, b?: IPosition) => {
	return a && b && a.id === b.id;
};

const isContained = (pos: IPosition, arr: IPosition[] = []): boolean => {
	for (const a of arr) {
		if (isEqual(a, pos)) {
			return true;
		}
	}
	return false;
};

const isOnStraightLine = (pos: IPosition, ref: IPosition): boolean => {
	return (pos.x === ref.x || pos.y === ref.y || 0 === (Math.abs(pos.x - ref.x) - Math.abs(pos.y - ref.y)));
};

const getSideTiles = (pos: IPosition, obstacles: IPosition[] = []): IPosition[] => {
	const neighbours: IPosition[] = [];

	neighbours.push(create(pos.x - 1, pos.y));
	neighbours.push(create(pos.x + 1, pos.y));
	neighbours.push(create(pos.x, pos.y - 1));
	neighbours.push(create(pos.x, pos.y + 1));

	return neighbours.filter(n => {
		return isInGrid(n) && !isContained(n, obstacles);
	});
};

const getNeighbours = (pos: IPosition, obstacles: IPosition[] = []): IPosition[] => {
	const neighbours: IPosition[] = [];

	for (let x = -1; x <= 1; x++) {
		for (let y = -1; y <= 1; y++) {
			if (!x && !y) {
				continue;
			}
			neighbours.push(create(pos.x + x, pos.y + y));
		}
	}

	return neighbours.filter(n => {
		return isInGrid(n) && !isContained(n, obstacles);
	});
};

const isInGrid = (pos: IPosition): boolean => {
	return pos.x >= 0 && pos.y >= 0 && pos.x < gridSize && pos.y < gridSize;
};

const getByDirection = (source: IPosition, dir: Direction) => {
	let pos: IPosition;

	switch (dir) {
		case Direction.TOP:
			pos = create(source.x, source.y - 1);
			break;

		case Direction.BOTTOM:
			pos = create(source.x, source.y + 1);
			break;

		case Direction.LEFT:
			pos = create(source.x - 1, source.y);
			break;

		case Direction.RIGHT:
			pos = create(source.x + 1, source.y);
			break;

		default:
			throw new Error('Invalid direction');
	}

	if (!isInGrid(pos)) {
		return;
	}
	return pos;
};

const getDirection = (source: IPosition, target: IPosition): Direction => {
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
};

export const Position = {
	NULL_POSITION: create(-1, -1),
	create,
	isEqual,
	isContained,
	isOnStraightLine,
	getSideTiles,
	getNeighbours,
	isInGrid,
	getByDirection,
	getDirection
};
