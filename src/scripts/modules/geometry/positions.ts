import { gridSize } from 'data/game-config';
import Position from 'modules/geometry/position';

interface IPositions {
	[id: string]: Position;
}
const positions: IPositions = {};

// convert coords to position ID
const toID = (x: number, y: number): string => `(${x}, ${y}})`;

// initialize game tile positions pool
const init = () => {
	// generate positions
	for (let x = 0; x < gridSize; x++) {
		for (let y = 0; y < gridSize; y++) {
			const id = toID(x, y);
			positions[id] = new Position(id, x, y, 1);
		}
	}

	// set position neighbours
	for (const id in positions) {
		const pos = positions[id];
		const posX = pos.x;
		const posY = pos.y;
		const neighbours: Position[] = [];

		for (let x = -1; x <= 1; x++) {
			for (let y = -1; y <= 1; y++) {
				if (!x && !y) {
					continue;
				}
				const nID = toID(posX + x, posY + y);
				const n = positions[nID] || null;

				if (null !== n) {
					neighbours.push(n);
				}
			}
		}

		const sideTiles = neighbours.filter(({ x, y }) => x === posX || y === posY);
		pos.setNeighbours(neighbours);
		pos.setSideTiles(sideTiles);
	}
};

init();

export const getPositionByID = (id: string): Position|null => {
	return positions[id] || null;
};

export const getPosition = (x: number, y: number): Position|null => {
	return getPositionByID(toID(x, y));
};

export const getPositions = (): Position[] => {
	return Object.keys(positions).map(id => positions[id]);
};
