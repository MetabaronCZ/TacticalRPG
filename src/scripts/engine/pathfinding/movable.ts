import PriorityQueue from 'core/priority-queue';

import Position from 'engine/position';
import CostMap from 'engine/pathfinding/cost-map';

interface IMovable {
	readonly positions: Position[];
	readonly costMap: CostMap;
}

// Dijkstra algorithm (movement cost based search)
export const getMovableTiles = (start: Position, obstacles: Position[], max: number): IMovable => {
	const movable: Position[] = [start];
	const frontier = new PriorityQueue<Position>();
	frontier.push(start, 0);

	const costMap = new CostMap();
	costMap.set(start, 0);

	while (frontier.size()) {
		const curr = frontier.get();

		if (!curr) {
			continue;
		}
		const neighbours = curr.getSideTiles(obstacles);

		for (const n of neighbours) {
			const newCost = costMap.get(curr) + n.getCost();

			if (newCost > max) {
				continue;
			}

			if (null === costMap.indexOf(n) || newCost < costMap.get(n)) {
				costMap.set(n, newCost);
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
