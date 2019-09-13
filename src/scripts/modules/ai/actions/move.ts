import Logger from 'modules/logger';
import { IAIData } from 'modules/ai/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';

const btMove = (): BTAction<IAIData> => {
	return BT.Action(data => {
		if (data.memory.hasMoved) {
			Logger.info('AI MOVE - already moved');
			return 'SUCCESS';
		}
		data.memory.hasMoved = true;

		const { decision } = data.memory;

		if (!decision) {
			Logger.info('AI MOVE - no move target decided');
			return 'SUCCESS';
		}
		const tile = decision.move;

		data.selectTile(tile);
		Logger.info('AI MOVE - target tile selected: ' + tile.id);

		return 'RUNNING';
	});
};

export default btMove;
