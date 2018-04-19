export interface IPosition {
	x: number;
	y: number;
	id: string;
	cost: number;
}

export class Position {
	public static NULL_POSITION: IPosition = Position.create(-1, -1);

	public static create(x: number = 0, y: number = 0): IPosition {
		return {
			x,
			y,
			id: x + '|' + y,
			cost: 1
		};
	}

	public static isEqual(a?: IPosition, b?: IPosition) {
		return a && b && a.id === b.id;
	}

	public static isContained(pos: IPosition, arr: IPosition[] = []): boolean {
		for (const a of arr) {
			if (Position.isEqual(a, pos)) {
				return true;
			}
		}
		return false;
	}

	public static isOnStraightLine(pos: IPosition, ref: IPosition): boolean {
		return (pos.x === ref.x || pos.y === ref.y || 0 === (Math.abs(pos.x - ref.x) - Math.abs(pos.y - ref.y)));
	}

	public static getSideTiles(pos: IPosition, obstacles: IPosition[], gridSize: number): IPosition[] {
		const neighbours: IPosition[] = [];

		neighbours.push(Position.create(pos.x - 1, pos.y));
		neighbours.push(Position.create(pos.x + 1, pos.y));
		neighbours.push(Position.create(pos.x, pos.y - 1));
		neighbours.push(Position.create(pos.x, pos.y + 1));

		return neighbours.filter(n => {
			return Position.isInGrid(n, gridSize) && !Position.isContained(n, obstacles);
		});
	}

	public static getNeighbours(pos: IPosition, obstacles: IPosition[], gridSize: number): IPosition[] {
		const neighbours: IPosition[] = [];

		for (let x = -1; x <= 1; x++) {
			for (let y = -1; y <= 1; y++) {
				if (!x && !y) {
					continue;
				}
				neighbours.push(Position.create(pos.x + x, pos.y + y));
			}
		}

		return neighbours.filter(n => {
			return Position.isInGrid(n, gridSize) && !Position.isContained(n, obstacles);
		});
	}

	public static isInGrid(pos: IPosition, gridSize: number): boolean {
		return pos.x >= 0 && pos.y >= 0 && pos.x < gridSize && pos.y < gridSize;
	}
}
