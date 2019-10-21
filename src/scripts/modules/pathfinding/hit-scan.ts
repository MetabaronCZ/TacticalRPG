import { characterBBox } from 'data/game-config';

import Tile from 'modules/geometry/tile';
import Vector from 'modules/geometry/vector';

export const getVisible = (tiles: Tile[], source: Tile, obstacles: Tile[]): Tile[] => {
	let visible = tiles.filter(t => t !== source);

	if (!visible.length || !obstacles.length) {
		return [];
	}

	for (const o of obstacles) {
		if (!visible.length) {
			return [];
		}

		if (!visible.includes(o)) {
			continue;
		}

		// (obstacle, source) vector
		const obstVec = Vector.fromTiles(source, o);
		const obstVecSize = obstVec.getSize();

		// angle between (obstacle, source) and (obstacle BBox, source) [Pythagorean theorem]
		const obstAngle = Math.abs(Math.atan(characterBBox / obstVecSize));

		const newVisible: Tile[] = [];

		// compute visible tiles according to its angle with source
		for (const tile of visible) {
			const tileVec = Vector.fromTiles(source, tile);
			const tileVecSize = tileVec.getSize();

			if (o === tile) {
				newVisible.push(tile);
				continue;
			}
			if (tileVecSize < obstVecSize) {
				// keep all tiles between source and obstacle
				newVisible.push(tile);
				continue;
			}
			const tileAngle = tileVec.getAngle(obstVec);
			// Math.atan2(tileVec.y, tileVec.x) - Math.atan2(obstVec.y, obstVec.x);

			if (Math.abs(tileAngle) >= obstAngle) {
				// keep tiles with angle greater than (obstacle, source) -> (obstacle BBox, source) angle
				newVisible.push(tile);
			}
		}
		visible = newVisible;
	}

	return visible;
};
