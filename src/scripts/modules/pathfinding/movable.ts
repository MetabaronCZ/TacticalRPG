import { maxJumpHeight } from 'data/game-config';
import PriorityQueue from 'core/priority-queue';

import Tile from 'modules/geometry/tile';
import { getTileByID } from 'modules/geometry/tiles';
import { getTerrainCost } from 'modules/geometry/terrain';

export interface IMoveCostMap {
	[id: string]: number;
}

interface IMovable {
	readonly tiles: Tile[];
	readonly costMap: IMoveCostMap;
}

// Dijkstra algorithm (movement cost based search)
export const getMovableTiles = (start: Tile, obstacles: Tile[], max: number): IMovable => {
	const movable: Tile[] = [];
	const frontier = new PriorityQueue<Tile>();
	frontier.push(start, 0);

	const costMap: IMoveCostMap = {};
	costMap[start.id] = 0;

	while (frontier.size()) {
		const curr = frontier.get();

		if (!curr) {
			continue;
		}
		const neighbours = curr.getSideTiles(obstacles);

		for (const n of neighbours) {
			const heightCost = Math.abs(curr.z - n.z);

			if (heightCost > maxJumpHeight) {
				continue;
			}
			const terrainCost = getTerrainCost(n.terrain);
			const newCost = costMap[curr.id] + heightCost + terrainCost;

			if (newCost > max) {
				continue;
			}

			if (!(n.id in costMap) || newCost < costMap[n.id]) {
				costMap[n.id] = newCost;
				frontier.push(n, newCost);
			}
		}
	}

	// get movable tiles
	for (const id in costMap) {
		const tile = getTileByID(id);

		if (null === tile) {
			throw new Error('Tile lost during movable computation');
		}
		movable.push(tile);
	}

	return { tiles: movable, costMap };
};
