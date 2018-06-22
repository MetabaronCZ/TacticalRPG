import { constructPath, IGraph } from 'modules/pathfinding';
import { Position, IPosition } from 'modules/position';

// Breadth first (shortest path at uniform maovement cost)
export const getShortestPath = (start: IPosition, target: IPosition, obstacles: IPosition[]) => {
	const graph: IGraph = {
		[start.id]: Position.NULL_POSITION
	};
	const frontier: IPosition[] = [start];

	while (frontier.length) {
		const curr = frontier.shift();

		if (!curr) {
			continue;
		}
		if (Position.isEqual(curr, target)) {
			break;
		}
		const neighbours = Position.getSideTiles(curr, obstacles);

		for (const n of neighbours) {
			if (!graph[n.id]) {
				frontier.push(n);
				graph[n.id] = curr;
			}
		}
	}
	return constructPath(start, target, graph);
};
