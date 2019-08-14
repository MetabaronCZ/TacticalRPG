import { getRandomized } from 'core/array';
import { gridSize } from 'data/game-config';

import Tile from 'modules/geometry/tile';
import { Color, maxColorValue } from 'modules/color';

interface ITiles {
	[id: string]: Tile;
}

const min = -(gridSize - 1);
const max = +(gridSize - 1);

const tiles: ITiles = {};

// convert coords to tile ID
const getTileID = (x: number, y: number, z: number): string => {
	return `(${x}, ${y}, ${z})`;
};

export const getTileByID = (id: string): Tile | null => {
	return tiles[id] || null;
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

export const getTiles = (): Tile[] => {
	return Object.keys(tiles).map(id => tiles[id]);
};

// initialize game tile pool
const init = (): void => {
	// generate tiles
	for (let x = min; x <= max; x++) {
		for (let y = min; y <= max; y++) {
			for (let z = min; z <= max; z++) {
				if (0 === x + y + z) {
					const id = getTileID(x, y, z);
					tiles[id] = new Tile(id, x, y, z, 1, 'DEFAULT');
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
