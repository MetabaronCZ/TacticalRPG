import Logger from 'modules/logger';
import { IAIData } from 'modules/ai/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';

const btTarget = (): BTAction<IAIData> => {
	return BT.Action(data => {
		if (data.memory.commandTargeted) {
			Logger.info('AI TARGET - already targeted');
			return 'SUCCESS';
		}
		data.memory.commandTargeted = true;

		const { decision } = data.memory;

		if (!decision) {
			Logger.info('AI TARGET - no command target decided');
			return 'SUCCESS';
		}
		const tile = decision.target;

		data.selectTile(tile);
		Logger.info('AI TARGET - target selected: ' + tile.id);

		return 'RUNNING';
	});
};

export default btTarget;
