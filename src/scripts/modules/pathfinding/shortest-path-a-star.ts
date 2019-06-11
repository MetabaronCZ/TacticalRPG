import { getRandomized } from 'core/array';
import PriorityQueue from 'core/priority-queue';

import { maxJumpHeight } from 'data/game-config';

import Tile from 'modules/geometry/tile';
import { getTerrainCost } from 'modules/geometry/terrain';
import { getPriority, constructPath, IGraph, ICostMap } from 'modules/pathfinding';

// A* algorithm (get shortest path according to movement cost)
export const getShortestPath = (start: Tile, target: Tile, obstacles: Tile[]): Tile[] => {
	const frontier = new PriorityQueue<Tile>();
	frontier.push(start, 0);

	const visited: IGraph = {};
	visited[start.id] = null;

	const cost: ICostMap = {};
	cost[start.id] = 0;

	while (frontier.size()) {
		const curr = frontier.get();

		if (!curr) {
			continue;
		}

		if (curr === target) {
			break;
		}
		let neighbours = curr.getSideTiles(obstacles);
		neighbours = getRandomized(neighbours);

		for (const n of neighbours) {
			const heightCost = Math.abs(curr.z - n.z);

			if (heightCost > maxJumpHeight) {
				continue;
			}
			const terrainCost = getTerrainCost(n.terrain);
			const newCost = cost[curr.id] + heightCost + terrainCost;

			if (!cost[n.id] || newCost < cost[n.id]) {
				const priority = newCost + getPriority(target, n);
				cost[n.id] = newCost;
				frontier.push(n, priority);
				visited[n.id] = curr;
			}
		}
	}
	return constructPath(start, target, visited);
};
