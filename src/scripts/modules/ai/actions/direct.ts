import { getRandomItem } from 'core/array';

import Logger from 'modules/logger';
import { IAIData } from 'modules/ai/character';
import { resolveDirection, findTileFrom } from 'modules/geometry/direction';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';

const btDirect = (): BTAction<IAIData> => {
	return BT.Action(data => {
		const { directable } = data.act.phases.DIRECTION;
		const { decision } = data.memory;

		const char = data.act.actor;
		const pos = char.position;
		let dir = char.direction;

		if (decision) {
			dir = resolveDirection(pos, decision.target);
		}
		let directTarget = findTileFrom(pos, dir);

		if (!directTarget) {
			directTarget = getRandomItem(directable);
		}

		if (!directTarget) {
			throw new Error('AI could not direct');
		}
		data.selectTile(directTarget);
		Logger.info('AI DIRECT - direction target selected: ' + directTarget.id);

		return 'SUCCESS';
	});
};

export default btDirect;
