import { IAIData } from 'modules/ai/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';

const btBlock = (): BTAction<IAIData> => {
	return BT.Action(data => {
		const blockCommand = data.commands.find(cmd => {
			return (
				cmd.isActive() &&
				cmd.skills.length &&
				(
					'SHD_SMALL_BLOCK' === cmd.skills[0].id ||
					'SHD_LARGE_BLOCK' === cmd.skills[0].id
				)
			);
		});
	
		if (!blockCommand) {
			return 'FAILURE';
		}
		data.selectCommand(blockCommand);
		return 'SUCCESS';
	});
};

export default btBlock;
