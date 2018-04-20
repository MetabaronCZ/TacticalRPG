import { constructPath, IGraph } from 'models/pathfinding';
import { Position, IPosition } from 'models/position';

// Breadth first (shortest path at uniform maovement cost)
export const getShortestPath = (start: IPosition, target: IPosition, obstacles: IPosition[], gridSize: number) => {
	const frontier: IPosition[] = [start];

	const graph: IGraph = {};
	graph[start.id] = Position.NULL_POSITION;

	while (frontier.length) {
		const curr = frontier.shift();

		if (!curr) {
			continue;
		}
		if (Position.isEqual(curr, target)) {
			break;
		}
		const neighbours = Position.getSideTiles(curr, obstacles, gridSize);

		for (const n of neighbours) {
			if (!graph[n.id]) {
				frontier.push(n);
				graph[n.id] = curr;
			}
		}
	}
	return constructPath(start, target, graph);
};