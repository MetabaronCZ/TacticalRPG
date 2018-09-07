import Position from 'engine/position';

export type DirectionID = 'TOP' | 'LEFT' | 'RIGHT' | 'BOTTOM';

type IByDirectionTable = {
	[T in DirectionID]: (pos: Position) => Position;
};

const byDirectionTable: IByDirectionTable = {
	TOP:    (pos: Position) => new Position(pos.getX(), pos.getY() - 1),
	BOTTOM: (pos: Position) => new Position(pos.getX(), pos.getY() + 1),
	LEFT:   (pos: Position) => new Position(pos.getX() - 1, pos.getY()),
	RIGHT:  (pos: Position) => new Position(pos.getX() + 1, pos.getY())
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
		const pos = byDirectionTable[dir](source);
		return pos.isInGrid() ? pos : null;
	}
}

export default Direction;
