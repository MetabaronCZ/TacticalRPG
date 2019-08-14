import Tile from 'modules/geometry/tile';
import { DirectionID } from 'modules/geometry/direction';

class Vector {
	public readonly x: number;
	public readonly y: number;
	public readonly z: number;

	constructor(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	public static fromTiles(a: Tile, b: Tile): Vector {
		return new Vector(b.x - a.x, b.y - a.y, b.z - a.z);
	}

	public static fromDirection(dir: DirectionID): Vector {
		switch (dir) {
			case 'N':  return new Vector(+0, +1, -1);
			case 'NE': return new Vector(+1, +0, -1);
			case 'SE': return new Vector(+1, -1, +0);
			case 'S':  return new Vector(+0, -1, +1);
			case 'SW': return new Vector(-1, +0, +1);
			case 'NW': return new Vector(-1, +1, +0);
			default:
				throw new Error('Invalid direction: ' + dir);
		}
	}

	public getSize(): number {
		const { x, y, z } = this;
		return Math.sqrt(x * x + y * y + z * z);
	}

	public getAngle(vector: Vector): number {
		const size = this.getSize() * vector.getSize();

		if (0 === size) {
			return 0;
		}
		const { x: ax, y: ay, z: az } = this;
		const { x: bx, y: by, z: bz } = vector;

		const dotProduct = ax * bx + ay * by + az * bz;

		// constraint value to [-1, 1] interval
		let result = dotProduct / size;
		result = Math.min(result, +1);
		result = Math.max(result, -1);

		const angle = Math.acos(result);
		return Math.abs(angle);
	}
}

export default Vector;
