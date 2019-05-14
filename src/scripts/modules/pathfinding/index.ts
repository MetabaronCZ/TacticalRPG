import Tile from 'modules/geometry/tile';

export interface IGraph {
	[id: string]: Tile | null;
}

export interface ICostMap {
	[id: string]: number;
}

export const getPriority = (a: Tile, b: Tile): number => {
	return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

export const constructPath = (start: Tile, target: Tile, graph: IGraph): Tile[] => {
	let curr: Tile | null = target;
	const path: Tile[] = [];

	while (curr !== start) {
		if (null === curr) {
			break;
		}
		path.push(curr);
		curr = graph[curr.id];
	}
	path.push(start);
	return path.reverse();
};

export { getMovableTiles } from 'modules/pathfinding/movable';
export { getShortestPath } from 'modules/pathfinding/shortest-path-a-star';
export { getShortestPath as getShortestPathB } from 'modules/pathfinding/shortest-path-breadth-first';
