import { IPosition, Position } from 'models/position';

export interface IGraph {
	[id: string]: IPosition;
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
	return path.reverse();
};

export { getMovableTiles } from 'models/pathfinding/movable';
export { getShortestPath } from 'models/pathfinding/shortest-path-a-star';
export { getShortestPath as getShortestPathB } from 'models/pathfinding/shortest-path-breadth-first';
export { default as PriorityQueue } from 'models/pathfinding/priority-queue';
