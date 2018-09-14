import Position from 'engine/position';
import { getPosition } from 'engine/positions';

export type DirectionID = 'TOP' | 'LEFT' | 'RIGHT' | 'BOTTOM';

type IByDirectionTable = {
	[T in DirectionID]: (pos: Position) => Position|null;
};

const byDirectionTable: IByDirectionTable = {
	TOP:    pos => getPosition(pos.getX(), pos.getY() - 1),
	BOTTOM: pos => getPosition(pos.getX(), pos.getY() + 1),
	LEFT:   pos => getPosition(pos.getX() - 1, pos.getY()),
	RIGHT:  pos => getPosition(pos.getX() + 1, pos.getY())
};

class Direction {
	public static resolve = (source: Position, target: Position): DirectionID => {
		const diffX = target.getX() - source.getX();
		const diffY = target.getY() - source.getY();

		if (Math.abs(diffX) > Math.abs(diffY)) {
			// horizontal direction
			return diffX < 0 ? 'LEFT' : 'RIGHT';

		} else {
			// vertical direction
			return diffY < 0 ? 'TOP' : 'BOTTOM';
		}
	}

	public static findPositionFrom(source: Position, dir: DirectionID): Position|null {
		return byDirectionTable[dir](source);
	}
}

export default Direction;
