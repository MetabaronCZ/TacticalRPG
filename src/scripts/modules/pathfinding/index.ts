import Position from 'modules/geometry/position';

export interface IGraph {
	[id: string]: Position|null;
}

export interface ICostMap {
	[id: string]: number;
}

export const getPriority = (a: Position, b: Position): number => {
	return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

export const constructPath = (start: Position, target: Position, graph: IGraph): Position[] => {
	let curr: Position|null = target;
	const path: Position[] = [];

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
