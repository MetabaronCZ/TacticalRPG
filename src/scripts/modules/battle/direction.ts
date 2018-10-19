import Position from 'modules/battle/position';
import { getPosition } from 'modules/battle/positions';

export type DirectionID = 'TOP' | 'LEFT' | 'RIGHT' | 'BOTTOM';

type IByDirectionTable = {
	[T in DirectionID]: (pos: Position) => Position|null;
};

const byDirectionTable: IByDirectionTable = {
	TOP:    ({ x, y }) => getPosition(x, y - 1),
	BOTTOM: ({ x, y }) => getPosition(x, y + 1),
	LEFT:   ({ x, y }) => getPosition(x - 1, y),
	RIGHT:  ({ x, y }) => getPosition(x + 1, y)
};

export const resolveDirection = (source: Position, target: Position): DirectionID => {
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

export const findPositionFrom = (source: Position, dir: DirectionID): Position|null => {
	return byDirectionTable[dir](source);
};
