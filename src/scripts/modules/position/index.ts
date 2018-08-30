import { gridSize } from 'data/game-config';
import { Direction } from 'modules/direction';
import { IPosition } from 'modules/position/types';

type IByDirectionTable = {
	[T in Direction]: (pos: IPosition) => IPosition;
};

const byDirectionTable: IByDirectionTable = {
	[Direction.TOP]:    (pos: IPosition) => create(pos.x, pos.y - 1),
	[Direction.BOTTOM]: (pos: IPosition) => create(pos.x, pos.y + 1),
	[Direction.LEFT]:   (pos: IPosition) => create(pos.x - 1, pos.y),
	[Direction.RIGHT]:  (pos: IPosition) => create(pos.x + 1, pos.y),
};

const create = (x: number = 0, y: number = 0): IPosition => ({
	x,
	y,
	id: x + '|' + y,
	cost: 1
});

const isEqual = (a?: IPosition, b?: IPosition): boolean => {
	return !!a && !!b && a.id === b.id;
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

const getSideTiles = (pos: IPosition, obstacles?: IPosition[]): IPosition[] => {
	const neighbours: IPosition[] = [
		create(pos.x - 1, pos.y),
		create(pos.x + 1, pos.y),
		create(pos.x, pos.y - 1),
		create(pos.x, pos.y + 1)
	];
	return neighbours.filter(n => {
		return isInGrid(n) && !isContained(n, obstacles);
	});
};

const getNeighbours = (pos: IPosition, obstacles?: IPosition[]): IPosition[] => {
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
	const pos = byDirectionTable[dir](source);
	return isInGrid(pos) ? pos : undefined;
};

const getDirection = (source: IPosition, target: IPosition): Direction => {
	const diffX = target.x - source.x;
	const diffY = target.y - source.y;

	if (Math.abs(diffX) > Math.abs(diffY)) {
		// horizontal direction
		return diffX < 0 ? Direction.LEFT : Direction.RIGHT;

	} else {
		// vertical direction
		return diffY < 0 ? Direction.TOP : Direction.BOTTOM;
	}
};

const Position = {
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

export default Position;
