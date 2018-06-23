import * as ArrayUtils from 'core/array';
import PriorityQueue from 'core/priority-queue';

import Position from 'modules/position';
import { IPosition } from 'modules/position/types';
import { getPriority, constructPath, IGraph, ICostMap } from 'modules/pathfinding';

// A* algorithm (get shortest path according to movement cost)
export const getShortestPath = (start: IPosition, target: IPosition, obstacles: IPosition[]): IPosition[] => {
	const frontier = new PriorityQueue<IPosition>();
	frontier.push(start, 0);

	const visited: IGraph = {};
	visited[start.id] = Position.NULL_POSITION;

	const cost: ICostMap = {};
	cost[start.id] = 0;

	while (frontier.size()) {
		const curr = frontier.get();

		if (!curr) {
			continue;
		}

		if (Position.isEqual(curr, target)) {
			break;
		}
		let neighbours = Position.getSideTiles(curr, obstacles);
		neighbours = ArrayUtils.randomize(neighbours);

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
