import { Terrain } from 'modules/geometry/terrain';

class Tile {
	public readonly id: string;
	public readonly x: number;
	public readonly y: number;
	public readonly z: number;
	public readonly terrain: Terrain;
	private neighbours: Tile[] = [];
	private sideTiles: Tile[] = [];

	constructor(id: string, x: number, y: number, z: number, terrain: Terrain) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.z = z;
		this.terrain = terrain;
	}

	public isContained = (arr: Tile[] = []): boolean => {
		return -1 !== arr.indexOf(this);
	}

	public isOnStraightLine(pos: Tile): boolean {
		const { x, y } = this;
		return (x === pos.x || y === pos.y || 0 === (Math.abs(x - pos.x) - Math.abs(y - pos.y)));
	}

	public getNeighbours(obstacles: Tile[] = []): Tile[] {
		if (!obstacles.length) {
			return this.neighbours;
		}
		return this.neighbours.filter(n => !n.isContained(obstacles));
	}

	public setNeighbours(neighbours: Tile[] = []) {
		this.neighbours = neighbours;
	}

	public getSideTiles(obstacles: Tile[] = []): Tile[] {
		if (!obstacles.length) {
			return this.sideTiles;
		}
		return this.sideTiles.filter(n => !n.isContained(obstacles));
	}

	public setSideTiles(sideTiles: Tile[] = []) {
		this.sideTiles = sideTiles;
	}
}

export default Tile;
