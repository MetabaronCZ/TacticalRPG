import Position from 'engine/position';
import { DirectionID } from 'engine/direction';

class Movement {
	private position: Position;
	private direction: DirectionID;

	constructor(position: Position, direction: DirectionID) {
		this.position = position;
		this.direction = direction;
	}

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
