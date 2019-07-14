import Tile from 'modules/geometry/tile';
import { getTile } from 'modules/geometry/tiles';

export type DirectionID = 'TOP' | 'LEFT' | 'RIGHT' | 'BOTTOM';

type IByDirectionTable = {
	readonly [T in DirectionID]: (tile: Tile) => Tile | null;
};

type IOpositeDirectionTable = {
	readonly [T in DirectionID]: DirectionID;
};

const byDirectionTable: IByDirectionTable = {
	TOP:    ({ x, y }) => getTile(x, y - 1),
	BOTTOM: ({ x, y }) => getTile(x, y + 1),
	LEFT:   ({ x, y }) => getTile(x - 1, y),
	RIGHT:  ({ x, y }) => getTile(x + 1, y)
};

const opositeDirectionTable: IOpositeDirectionTable = {
	TOP: 'BOTTOM',
	BOTTOM: 'TOP',
	LEFT: 'RIGHT',
	RIGHT: 'LEFT'
};

export const resolveDirection = (source: Tile, target: Tile): DirectionID => {
	const diffX = target.x - source.x;
	const diffY = target.y - source.y;

	if (Math.abs(diffX) > Math.abs(diffY)) {
		// horizontal direction
		return diffX < 0 ? 'LEFT' : 'RIGHT';

	} else {
		// vertical direction
		return diffY < 0 ? 'TOP' : 'BOTTOM';
	}
};

export const findTileFrom = (source: Tile, dir: DirectionID): Tile | null => {
	return byDirectionTable[dir](source);
};

export const getOpositeDirection = (dir: DirectionID): DirectionID => {
	return opositeDirectionTable[dir];
};
