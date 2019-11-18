import { maxJumpHeight } from 'data/game-config';
import PriorityQueue from 'core/priority-queue';

import Tile from 'modules/geometry/tile';
import { ICostMap } from 'modules/pathfinding';
import { getTileByID } from 'modules/geometry/tiles';
import { getTerrainCost } from 'modules/geometry/terrain';

interface IMovable {
	readonly tiles: Tile[];
	readonly costMap: ICostMap;
}

// Dijkstra algorithm (movement cost based search)
export const getMovableTiles = (start: Tile, obstacles: Tile[], max: number): IMovable => {
	const frontier = new PriorityQueue<Tile>();
	frontier.push(start, 0);

	const costMap: ICostMap = {};
	costMap[start.id] = 0;

	const movable: Tile[] = [];

	while (frontier.size()) {
		const curr = frontier.get();

		if (!curr) {
			continue;
		}
		const neighbours = curr.getNeighbours(obstacles);

		for (const n of neighbours) {
			const heightCost = Math.abs(curr.h - n.h);

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

		if (!tile) {
			throw new Error('Tile lost during movable computation');
		}
		movable.push(tile);
	}

	return { tiles: movable, costMap };
};
