import PriorityQueue from 'core/priority-queue';

import Position from 'engine/position';

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
		const pos = id.split('|');
		const x = parseInt(pos[0], 10);
		const y = parseInt(pos[1], 10);
		movable.push(new Position(x, y));
	}

	return { positions: movable, costMap };
};
