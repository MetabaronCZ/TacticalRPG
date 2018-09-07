import { gridSize } from 'data/game-config';

class Position {
	public static NULL_POSITION = new Position(-1, -1);

	private x: number;
	private y: number;
	private cost: number;

	constructor(x: number, y: number, cost = 1) {
		this.x = x;
		this.y = y;
		this.cost = 1;
	}

	public static isEqual(a: Position, b: Position): boolean {
		return a.getX() === b.getX() && a.getY() === b.getY();
	}

	public isInGrid(): boolean {
		const { x, y } = this;
		return x >= 0 && y >= 0 && x < gridSize && y < gridSize;
	}

	public isContained = (arr: Position[] = []): boolean => {
		for (const a of arr) {
			if (Position.isEqual(this, a)) {
				return true;
			}
		}
		return false;
	}

	public isOnStraightLine(pos: Position): boolean {
		const { x, y } = this;
		const posX = pos.getX();
		const posY = pos.getY();
		return (x === posX || y === posY || 0 === (Math.abs(x - posX) - Math.abs(y - posY)));
	}

	public getX() {
		return this.x;
	}

	public getY() {
		return this.y;
	}

	public getCost() {
		return this.cost;
	}

	public getSideTiles(obstacles: Position[] = []): Position[] {
		const { x, y } = this;

		const neighbours: Position[] = [
			new Position(x - 1, y),
			new Position(x + 1, y),
			new Position(x, y - 1),
			new Position(x, y + 1)
		];
		return neighbours.filter(n => {
			return n.isInGrid() && !n.isContained(obstacles);
		});
	}

	public getNeighbours(obstacles: Position[] = []): Position[] {
		const neighbours: Position[] = [];
		const posX = this.x;
		const posY = this.y;

		for (let x = -1; x <= 1; x++) {
			for (let y = -1; y <= 1; y++) {
				if (!x && !y) {
					continue;
				}
				neighbours.push(new Position(posX + x, posY + y));
			}
		}

		return neighbours.filter(n => {
			return n.isInGrid() && !n.isContained(obstacles);
		});
	}
}

export default Position;
