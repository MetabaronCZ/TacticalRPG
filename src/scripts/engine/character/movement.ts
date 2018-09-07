import Position from 'engine/position';
import { DirectionID } from 'engine/direction';

class Movement {
	private position = Position.NULL_POSITION;
	private direction: DirectionID = 'RIGHT';

	public getPosition(): Position {
		return this.position;
	}

	public setPosition(pos: Position) {
		this.position = pos;
	}

	public getDirection(): DirectionID {
		return this.direction;
	}

	public setDirection(direction: DirectionID) {
		this.direction = direction;
	}
}

export default Movement;
