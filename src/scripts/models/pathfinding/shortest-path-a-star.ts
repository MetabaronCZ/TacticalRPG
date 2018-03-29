import * as Array from 'utils/array';

import { Position, IPosition } from 'models/position';
import { getPriority, constructPath, PriorityQueue, IPath, IGraph } from 'models/pathfinding';

// A* algorithm (get shortest path according to movement cost)
export const getShortestPath = (start: IPosition, target: IPosition, obstacles: IPosition[], gridSize: number): IPath => {
	const frontier = new PriorityQueue<IPosition>();
	frontier.push(start, 0);

	const visited: IGraph = {};
	visited[start.id] = Position.NULL_POSITION;

	const cost: { [id: string]: number } = {};
	cost[start.id] = 0;

	while (frontier.size()) {
		const curr = frontier.get();

		if (!curr) {
			continue;
		}

		if (Position.isEqual(curr, target)) {
			break;
		}
		let neighbours = Position.getNeighbours(curr, obstacles, gridSize);
		neighbours = Array.randomizeArray(neighbours);

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
