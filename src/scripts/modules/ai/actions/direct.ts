import { getRandomItem } from 'core/array';

import Logger from 'modules/logger';
import { IAIData } from 'modules/ai/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';

const btDirect = (): BTAction<IAIData> => {
	return BT.Action(data => {
		const { directable } = data.act.phases.DIRECTION;
		const { decision } = data.memory;

		if (!decision) {
			Logger.info('AI DECISION - no decision target decided');
			return 'SUCCESS';
		}
		const tile = decision.direct || getRandomItem(directable);

		if (!tile) {
			throw new Error('AI could not direct');
		}
		data.selectTile(tile);
		Logger.info('AI DIRECT - direction target selected: ' + tile.id);

		return 'SUCCESS';
	});
};

export default btDirect;
