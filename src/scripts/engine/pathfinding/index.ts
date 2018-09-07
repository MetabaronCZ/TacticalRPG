import Graph from 'engine/pathfinding/graph';
import Position from 'engine/position';

export const getPriority = (a: Position, b: Position): number => {
	return Math.abs(a.getX() - b.getX()) + Math.abs(a.getY() - b.getY());
};

export const constructPath = (start: Position, target: Position, graph: Graph): Position[] => {
	let curr = target;
	const path: Position[] = [];

	while (!Position.isEqual(curr, start)) {
		if (Position.isEqual(curr, Position.NULL_POSITION)) {
			break;
		}
		path.push(curr);

		const next = graph.get(curr);

		if (null !== next) {
			curr = next;
		} else {
			break;
		}
	}
	path.push(start);
	return path.reverse();
};

export { getMovableTiles } from 'engine/pathfinding/movable';
export { getShortestPath } from 'engine/pathfinding/shortest-path-a-star';
export { getShortestPath as getShortestPathB } from 'engine/pathfinding/shortest-path-breadth-first';
