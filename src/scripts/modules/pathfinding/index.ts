import { IPosition, Position } from 'modules/position';

export interface IGraph {
	[id: string]: IPosition;
}

export interface ICostMap {
	[id: string]: number;
}

export const getPriority = (a: IPosition, b: IPosition): number => {
	return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

export const constructPath = (start: IPosition, target: IPosition, graph: IGraph): IPosition[] => {
	let curr: IPosition = target;
	const path: IPosition[] = [];

	while (!Position.isEqual(curr, start)) {
		if (Position.isEqual(curr, Position.NULL_POSITION)) {
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
