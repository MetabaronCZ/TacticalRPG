import { randomizeArray } from 'core/array';
import PriorityQueue from 'core/priority-queue';

import Position from 'modules/geometry/position';
import { getPriority, constructPath, IGraph, ICostMap } from 'modules/pathfinding';

// A* algorithm (get shortest path according to movement cost)
export const getShortestPath = (start: Position, target: Position, obstacles: Position[]): Position[] => {
	const frontier = new PriorityQueue<Position>();
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
		neighbours = randomizeArray(neighbours);

		for (const n of neighbours) {
			const newCost = cost[curr.id] + n.cost;

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
