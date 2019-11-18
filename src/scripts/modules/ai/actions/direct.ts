import { getRandomItem } from 'core/array';

import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import BT from 'modules/ai/behavioral-tree';
import { IAIData } from 'modules/ai/character';
import { ICharacterSnapshot } from 'modules/character';
import BTAction from 'modules/ai/behavioral-tree/action';
import { resolveDirection, findTileFrom } from 'modules/geometry/direction';
import { getShortestPath } from 'modules/pathfinding/shortest-path-breadth-first';

interface IClosestEnemy {
	readonly character: ICharacterSnapshot;
	readonly distance: number;
}

const btDirect = (): BTAction<IAIData> => {
	return BT.Action(data => {
		const { act, enemy } = data;
		const { actor, phases } = act;

		const pos = actor.position;
		const { directable } = phases.DIRECTION;
		const enemies = enemy.filter(char => !char.dead && !char.dying);

		// get closest enemy
		let closestEnemy: IClosestEnemy | null = null;

		for (const char of enemies) {
			const path = getShortestPath(pos, char.position, []);
			const distance = path.length;

			if (!closestEnemy || distance < closestEnemy.distance) {
				closestEnemy = {
					character: char,
					distance
				};
			}
		}

		// direct to closest enemy
		let directTarget: Tile | null = null;

		if (closestEnemy) {
			const closestPos = closestEnemy.character.position;
			const dir = resolveDirection(pos, closestPos);
			const dirTile = findTileFrom(pos, dir);
			directTarget = dirTile;
		}
		directTarget = directTarget || getRandomItem(directable);

		if (!directTarget) {
			throw new Error('AI could not direct');
		}
		data.selectTile(directTarget);
		Logger.info('AI DIRECT - direction target selected: ' + directTarget.id);

		return 'SUCCESS';
	});
};

export default btDirect;
