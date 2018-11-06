import { Terrain } from 'modules/geometry/terrain';

class Position {
	public readonly id: string;
	public readonly x: number;
	public readonly y: number;
	public readonly terrain: Terrain;
	private neighbours: Position[] = [];
	private sideTiles: Position[] = [];

	constructor(id: string, x: number, y: number, terrain: Terrain) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.terrain = terrain;
	}

	public isContained = (arr: Position[] = []): boolean => {
		return -1 !== arr.indexOf(this);
	}

	public isOnStraightLine(pos: Position): boolean {
		const { x, y } = this;
		return (x === pos.x || y === pos.y || 0 === (Math.abs(x - pos.x) - Math.abs(y - pos.y)));
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
