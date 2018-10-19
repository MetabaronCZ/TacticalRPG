class Position {
	public readonly id: string;
	public readonly x: number;
	public readonly y: number;
	public readonly cost: number;
	private neighbours: Position[] = [];
	private sideTiles: Position[] = [];

	constructor(id: string, x: number, y: number, cost: number) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.cost = cost;
	}

	public isContained = (arr: Position[] = []): boolean => {
		return -1 !== arr.indexOf(this);
	}

	public isOnStraightLine(pos: Position): boolean {
		const { x, y } = this;
		const { x: posX, y: posY } = pos;
		return (x === posX || y === posY || 0 === (Math.abs(x - posX) - Math.abs(y - posY)));
	}

	public getNeighbours(obstacles: Position[] = []): Position[] {
		if (!obstacles.length) {
			return this.neighbours;
		}
		return this.neighbours.filter(n => !n.isContained(obstacles));
	}

	public setNeighbours(neighbours: Position[] = []) {
		this.neighbours = neighbours;
	}

	public getSideTiles(obstacles: Position[] = []): Position[] {
		if (!obstacles.length) {
			return this.sideTiles;
		}
		return this.sideTiles.filter(n => !n.isContained(obstacles));
	}

	public setSideTiles(sideTiles: Position[] = []) {
		this.sideTiles = sideTiles;
	}
}

export default Position;
