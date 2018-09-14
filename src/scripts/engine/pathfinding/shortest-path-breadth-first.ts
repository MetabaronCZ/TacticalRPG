import Position from 'engine/position';
import { constructPath, IGraph } from 'engine/pathfinding';

// Breadth first (shortest path at uniform maovement cost)
export const getShortestPath = (start: Position, target: Position, obstacles: Position[]) => {
	const graph: IGraph = {
		[start.getId()]: null
	};
	const frontier: Position[] = [start];

	while (frontier.length) {
		const curr = frontier.shift();

		if (!curr) {
			continue;
		}
		if (curr === target) {
			break;
		}
		const neighbours = curr.getSideTiles(obstacles);

		for (const n of neighbours) {
			if (!graph[n.getId()]) {
				frontier.push(n);
				graph[n.getId()] = curr;
			}
		}
	}
	return constructPath(start, target, graph);
};
