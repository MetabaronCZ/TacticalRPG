import PriorityQueue from 'core/priority-queue';
import { Position, IPosition } from 'modules/position';

export interface IMoveCostMap {
	[id: string]: number;
}

export interface IMovable {
	movable: IPosition[];
	cost: IMoveCostMap;
}

// Dijkstra algorithm (movement cost based search)
export const getMovableTiles = (start: IPosition, obstacles: IPosition[], max: number): IMovable => {
	const movable: IPosition[] = [start];
	const frontier = new PriorityQueue<IPosition>();
	frontier.push(start, 0);

	const cost: IMoveCostMap = {};
	cost[start.id] = 0;

	while (frontier.size()) {
		const curr = frontier.get();

		if (!curr) {
			continue;
		}
		const neighbours = Position.getSideTiles(curr, obstacles);

		for (const n of neighbours) {
			const newCost = cost[curr.id] + n.cost;

			if (newCost > max) {
				continue;
			}

			if (!(n.id in cost) || newCost < cost[n.id]) {
				cost[n.id] = newCost;
				frontier.push(n, newCost);
			}
		}
	}

	// get movable tiles
	for (const id in cost) {
		const pos = id.split('|');
		const x = parseInt(pos[0], 10);
		const y = parseInt(pos[1], 10);
		movable.push(Position.create(x, y));
	}

	return { movable, cost };
};
