import Tile from 'modules/geometry/tile';
import { DirectionID } from 'modules/geometry/direction';

export class Vector2D {
	public readonly x: number;
	public readonly y: number;

	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	public static fromTiles(a: Tile, b: Tile): Vector2D {
		return new Vector2D(b.x - a.x, b.y - a.y);
	}

	public static fromDirection(dir: DirectionID): Vector2D {
		switch (dir) {
			case 'TOP':		return new Vector2D(+0, -1);
			case 'BOTTOM':	return new Vector2D(+0, +1);
			case 'LEFT':	return new Vector2D(-1, +0);
			case 'RIGHT':	return new Vector2D(+1, +0);
		}
	}

	public getAngle(vector: Vector2D): number {
		const { x: ax, y: ay } = this;
		const { x: bx, y: by } = vector;
		const angle = Math.atan2(ax * by - ay * bx, ax * bx + ay * by);
		return Math.abs(angle);
	}
}
