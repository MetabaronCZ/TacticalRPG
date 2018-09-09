import Position from 'engine/position';

export interface IGraph {
	[id: string]: Position;
}

export interface ICostMap {
	[id: string]: number;
}

export const getPriority = (a: Position, b: Position): number => {
	return Math.abs(a.getX() - b.getX()) + Math.abs(a.getY() - b.getY());
};

export const constructPath = (start: Position, target: Position, graph: IGraph): Position[] => {
	let curr = target;
	const path: Position[] = [];

	while (!Position.isEqual(curr, start)) {
		if (Position.isEqual(curr, Position.NULL_POSITION)) {
			break;
		}
		path.push(curr);
		curr = graph[curr.getId()];
	}
	path.push(start);
	return path.reverse();
};

export { getMovableTiles } from 'engine/pathfinding/movable';
export { getShortestPath } from 'engine/pathfinding/shortest-path-a-star';
export { getShortestPath as getShortestPathB } from 'engine/pathfinding/shortest-path-breadth-first';
