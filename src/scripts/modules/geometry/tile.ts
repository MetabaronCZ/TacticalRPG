import { Color } from 'modules/color';
import { Terrain } from 'modules/geometry/terrain';

class Tile {
	public readonly id: string;
	public readonly x: number;
	public readonly y: number;
	public readonly z: number;
	public readonly h: number;
	public readonly terrain: Terrain;

	private color: Color = [0, 0, 0];
	private neighbours: Tile[] = [];

	constructor(id: string, x: number, y: number, z: number, h: number, terrain: Terrain) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.z = z;
		this.h = h;
		this.terrain = terrain;
	}

	public isContained = (arr: Tile[]): boolean => {
		return arr.includes(this);
	}

	public isOnStraightLine(pos: Tile): boolean {
		const { x, y, z } = this;
		return (x === pos.x || y === pos.y || z === pos.z);
	}

	public getNeighbours(obstacles: Tile[] = []): Tile[] {
		if (!obstacles.length) {
			return this.neighbours;
		}
		return this.neighbours.filter(n => !n.isContained(obstacles));
	}

	public getColor(): Color {
		return this.color;
	}

	public setNeighbours(neighbours: Tile[] = []): void {
		this.neighbours = neighbours;
	}

	public setColor(color: Color): void {
		this.color = color;
	}
}

export default Tile;
