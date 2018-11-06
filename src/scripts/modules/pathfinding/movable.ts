import PriorityQueue from 'core/priority-queue';

import Position from 'modules/geometry/position';
import { getTerrainCost } from 'modules/geometry/terrain';
import { getPositionByID } from 'modules/geometry/positions';

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
	costMap[start.id] = 0;

	while (frontier.size()) {
		const curr = frontier.get();

		if (!curr) {
			continue;
		}
		const neighbours = curr.getSideTiles(obstacles);

		for (const n of neighbours) {
			const terrainCost = getTerrainCost(n.terrain);
			const newCost = costMap[curr.id] + terrainCost;

			if (newCost > max) {
				continue;
			}

			if (!(n.id in costMap) || newCost < costMap[n.id]) {
				costMap[n.id] = newCost;
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
