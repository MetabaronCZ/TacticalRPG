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

	public static getNeighbours(pos: IPosition, obstacles: IPosition[], gridSize: number): IPosition[] {
		const neighbours: IPosition[] = [];

		if (pos.x - 1 >= 0) {
			neighbours.push(Position.create(pos.x - 1, pos.y));
		}
		if (pos.x + 1 < gridSize) {
			neighbours.push(Position.create(pos.x + 1, pos.y));
		}
		if (pos.y - 1 >= 0) {
			neighbours.push(Position.create(pos.x, pos.y - 1));
		}
		if (pos.y + 1 < gridSize) {
			neighbours.push(Position.create(pos.x, pos.y + 1));
		}
		return neighbours.filter(n => !Position.isContained(n, obstacles));
	}
}
