import * as ArrayUtils from 'core/array';
import PriorityQueue from 'core/priority-queue';

import Position from 'engine/position';
import Graph from 'engine/pathfinding/graph';
import CostMap from 'engine/pathfinding/cost-map';
import { getPriority, constructPath } from 'engine/pathfinding';

// A* algorithm (get shortest path according to movement cost)
export const getShortestPath = (start: Position, target: Position, obstacles: Position[]): Position[] => {
	const frontier = new PriorityQueue<Position>();
	frontier.push(start, 0);

	const visited = new Graph();
	visited.set(start, Position.NULL_POSITION);

	const costMap = new CostMap();
	costMap.set(start, 0);

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
			const newCost = costMap.get(curr) + n.getCost();

			if (null === costMap.indexOf(n) || newCost < costMap.get(n)) {
				const priority = newCost + getPriority(target, n);
				costMap.set(n, newCost);
				frontier.push(n, priority);
				visited.set(n, curr);
			}
		}
	}
	return constructPath(start, target, visited);
};
