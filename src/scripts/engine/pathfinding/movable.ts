import PriorityQueue from 'core/priority-queue';

import Position from 'engine/position';
import { getPositionByID } from 'engine/positions';

export interface IMoveCostMap {
	[id: string]: number;
}

interface IMovable {
	readonly positions: Position[];
	readonly costMap: IMoveCostMap;
}

// Dijkstra algorithm (movement cost based search)
export const getMovableTiles = (start: Position, obstacles: Position[], max: number): IMovable => {
	const movable: Position[] = [];
	const frontier = new PriorityQueue<Position>();
	frontier.push(start, 0);

	const costMap: IMoveCostMap = {};
	costMap[start.getId()] = 0;

	while (frontier.size()) {
		const curr = frontier.get();

		if (!curr) {
			continue;
		}
		const neighbours = curr.getSideTiles(obstacles);

		for (const n of neighbours) {
			const newCost = costMap[curr.getId()] + n.getCost();

			if (newCost > max) {
				continue;
			}

			if (!(n.getId() in costMap) || newCost < costMap[n.getId()]) {
				costMap[n.getId()] = newCost;
				frontier.push(n, newCost);
			}
		}
	}

	// get movable tiles
	for (const id in costMap) {
		const pos = getPositionByID(id);

		if (null === pos) {
			throw new Error('Position lost during movable computation');
		}
		movable.push(pos);
	}

	return { positions: movable, costMap };
};
