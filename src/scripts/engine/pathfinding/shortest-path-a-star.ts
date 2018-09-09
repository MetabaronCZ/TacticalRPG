import * as ArrayUtils from 'core/array';
import PriorityQueue from 'core/priority-queue';

import Position from 'engine/position';
import { getPriority, constructPath, IGraph, ICostMap } from 'engine/pathfinding';

// A* algorithm (get shortest path according to movement cost)
export const getShortestPath = (start: Position, target: Position, obstacles: Position[]): Position[] => {
	const frontier = new PriorityQueue<Position>();
	frontier.push(start, 0);

	const visited: IGraph = {};
	visited[start.getId()] = Position.NULL_POSITION;

	const cost: ICostMap = {};
	cost[start.getId()] = 0;

	while (frontier.size()) {
		const curr = frontier.get();

		if (!curr) {
			continue;
		}

		if (Position.isEqual(curr, target)) {
			break;
		}
		let neighbours = curr.getSideTiles(obstacles);
		neighbours = ArrayUtils.randomize(neighbours);

		for (const n of neighbours) {
			const newCost = cost[curr.getId()] + n.getCost();

			if (!cost[n.getId()] || newCost < cost[n.getId()]) {
				const priority = newCost + getPriority(target, n);
				cost[n.getId()] = newCost;
				frontier.push(n, priority);
				visited[n.getId()] = curr;
			}
		}
	}
	return constructPath(start, target, visited);
};
