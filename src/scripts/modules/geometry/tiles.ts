import { gridSize } from 'data/game-config';
import Tile from 'modules/geometry/tile';

interface ITiles {
	[id: string]: Tile;
}
const tiles: ITiles = {};

// convert coords to tile ID
const getTileID = (x: number, y: number): string => `(${x}, ${y}})`;

// initialize game tile pool
const init = () => {
	// generate tiles
	for (let x = 0; x < gridSize; x++) {
		for (let y = 0; y < gridSize; y++) {
			const id = getTileID(x, y);
			tiles[id] = new Tile(id, x, y, 1, 'DEFAULT');
		}
	}

	// set tile neighbours
	for (const id in tiles) {
		const tile = tiles[id];
		const posX = tile.x;
		const posY = tile.y;
		const neighbours: Tile[] = [];

		for (let x = -1; x <= 1; x++) {
			for (let y = -1; y <= 1; y++) {
				if (!x && !y) {
					continue;
				}
				const nID = getTileID(posX + x, posY + y);
				const n = tiles[nID] || null;

				if (null !== n) {
					neighbours.push(n);
				}
			}
		}

		const sideTiles = neighbours.filter(({ x, y }) => x === posX || y === posY);
		tile.setNeighbours(neighbours);
		tile.setSideTiles(sideTiles);
	}
};

init();

export const getTileByID = (id: string): Tile|null => {
	return tiles[id] || null;
};

export const getTile = (x: number, y: number): Tile|null => {
	return getTileByID(getTileID(x, y));
};

export const getTiles = (): Tile[] => {
	return Object.keys(tiles).map(id => tiles[id]);
};
