import Tile from 'modules/geometry/tile';
import { constructPath, IGraph } from 'modules/pathfinding';

// Breadth first (shortest path at uniform movement cost)
export const getShortestPath = (start: Tile, target: Tile, obstacles: Tile[]): Tile[] => {
	const graph: IGraph = {
		[start.id]: null
	};
	const frontier: Tile[] = [start];

	while (frontier.length) {
		const curr = frontier.shift();

		if (!curr) {
			continue;
		}
		if (curr === target) {
			break;
		}
		const neighbours = curr.getNeighbours(obstacles);

		for (const n of neighbours) {
			if (!graph[n.id]) {
				frontier.push(n);
				graph[n.id] = curr;
			}
		}
	}
	return constructPath(start, target, graph);
};
