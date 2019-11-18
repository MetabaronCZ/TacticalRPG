import Tile from 'modules/geometry/tile';
import { getTile } from 'modules/geometry/tiles';

export type DirectionID = 'N' | 'NE' | 'SE' | 'S' | 'SW' | 'NW';

type IByDirectionTable = {
	readonly [T in DirectionID]: (tile: Tile) => Tile | null;
};

const byDirectionTable: IByDirectionTable = {
	N:  ({ x, y, z }) => getTile(x + 0, y + 1, z - 1),
	NE: ({ x, y, z }) => getTile(x + 1, y + 0, z - 1),
	SE: ({ x, y, z }) => getTile(x + 1, y - 1, z + 0),
	S:  ({ x, y, z }) => getTile(x + 0, y - 1, z + 1),
	SW: ({ x, y, z }) => getTile(x - 1, y + 0, z + 1),
	NW: ({ x, y, z }) => getTile(x - 1, y + 1, z + 0)
};

export const resolveDirection = (source: Tile, target: Tile): DirectionID => {
	const diffX = target.x - source.x;
	const diffY = target.y - source.y;
	const diffZ = target.z - source.z;

	if (diffX <= 0) {
		// target is left from source
		if (diffX >= diffZ) {
			return 'N';
		}
		if (diffX >= diffY) {
			return 'S';
		}
		return diffY >= diffZ ? 'NW' : 'SW';

	} else {
		// target is right from source
		if (diffY >= diffX) {
			return 'N';
		}
		if (diffZ >= diffX) {
			return 'S';
		}
		return diffY >= diffZ ? 'NE' : 'SE';
	}
};

const dirToIndexTable: { [id in DirectionID]: number; } = {
	N:  0,
	NE: 1,
	SE: 2,
	S:  3,
	SW: 4,
	NW: 5
};
export const dirToIndex = (dir: DirectionID): number => dirToIndexTable[dir];

export const findTileFrom = (source: Tile, dir: DirectionID): Tile | null => {
	return byDirectionTable[dir](source);
};
