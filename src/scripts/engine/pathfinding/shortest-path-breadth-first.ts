import Position from 'engine/position';
import Graph from 'engine/pathfinding/graph';
import { constructPath } from 'engine/pathfinding';

// Breadth first (shortest path at uniform maovement cost)
export const getShortestPath = (start: Position, target: Position, obstacles: Position[]) => {
	const graph = new Graph();
	graph.set(start, Position.NULL_POSITION);

	const frontier: Position[] = [start];

	while (frontier.length) {
		const curr = frontier.shift();

		if (!curr) {
			continue;
		}
		if (Position.isEqual(curr, target)) {
			break;
		}
		const neighbours = curr.getSideTiles(obstacles);

		for (const n of neighbours) {
			if (null === graph.indexOf(n)) {
				frontier.push(n);
				graph.set(n, curr);
			}
		}
	}
	return constructPath(start, target, graph);
};
