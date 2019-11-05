import { getRandomized } from 'core/array';
import { gridSize } from 'data/game-config';

import Tile from 'modules/geometry/tile';
import { Color, maxColorValue } from 'modules/color';

interface ITiles {
	[id: string]: {
		readonly tile: Tile;
		destroyed: boolean;
	};
}

const min = -(gridSize - 1);
const max = +(gridSize - 1);

const tiles: ITiles = {};

// convert coords to tile ID
const getTileID = (x: number, y: number, z: number): string => {
	return `(${x}, ${y}, ${z})`;
};

export const getTileByID = (id: string): Tile | null => {
	const data = tiles[id];

	if (!data || data.destroyed) {
		return null;
	}
	return data.tile;
};

export const getTile = (x: number, y: number, z: number): Tile | null => {
	const id = getTileID(x, y, z);
	return getTileByID(id);
};

export const getSafeTile = (x: number, y: number, z: number): Tile => {
	const tile = getTile(x, y, z);

	if (!tile) {
		throw new Error(`Invalid tile coordinates: (${x}, ${y}, ${z})`);
	}
	return tile;
};

export const getTiles = (includeDestroyed = false): Tile[] => {
	return Object.keys(tiles)
		.filter(id => includeDestroyed ? true : !tiles[id].destroyed)
		.map(id => tiles[id].tile);
};

export const isTileDestroyed = (tile: Tile): boolean => {
	const data = tiles[tile.id];

	if (!data) {
		throw new Error(`Invalid tile: ${tile.id}`);
	}
	return data.destroyed;
};

// remove tile from grid
export const destroyTile = (tile: Tile): void => {
	if (tiles[tile.id].destroyed) {
		return;
	}
	tiles[tile.id].destroyed = true;

	for (const id in tiles) {
		const t = tiles[id].tile;
		const neighbours = t.getNeighbours([tile]);
		t.setNeighbours(neighbours);
	}
};

// initialize game tile pool
const init = (): void => {
	// generate tiles
	for (let x = min; x <= max; x++) {
		for (let y = min; y <= max; y++) {
			for (let z = min; z <= max; z++) {
				if (0 === x + y + z) {
					const id = getTileID(x, y, z);

					tiles[id] = {
						tile: new Tile(id, x, y, z, 1, 'DEFAULT'),
						destroyed: false
					};
				}
			}
		}
	}
	const tileList = getTiles();

	// set tile neighbours
	for (const tile of tileList) {
		const nCoords: Array<[number, number, number]> = [
			[tile.x, tile.y + 1, tile.z - 1],
			[tile.x, tile.y - 1, tile.z + 1],
			[tile.x + 1, tile.y, tile.z - 1],
			[tile.x - 1, tile.y, tile.z + 1],
			[tile.x + 1, tile.y - 1, tile.z],
			[tile.x - 1, tile.y + 1, tile.z]
		];
		const neighbours: Tile[] = [];

		for (const c of nCoords) {
			const nID = getTileID(c[0], c[1], c[2]);
			const n = getTileByID(nID);

			if (n) {
				neighbours.push(n);
			}
		}
		tile.setNeighbours(neighbours);
	}

	// generate Tile hitbox colors
	const colorStep = Math.floor(256 / Math.cbrt(tileList.length));
	let lastColor: Color = [1, 1, 1];

	const getUniqueColor = (): Color => {
		let [r, g, b] = lastColor;
		b += colorStep;

		if (b > maxColorValue) {
			b = b % maxColorValue;
			g += colorStep;
		}
		if (g > maxColorValue) {
			g = g % maxColorValue;
			r += colorStep;
		}
		if (r > maxColorValue) {
			throw new Error('Not enough colors');
		}
		lastColor = [r, g, b];
		return lastColor;
	};

	let colors = tileList.map(() => getUniqueColor());
	colors = getRandomized(colors);

	// assign tile colors
	tileList.forEach((tile, i) => {
		tile.setColor(colors[i]);
	});
};

init();
