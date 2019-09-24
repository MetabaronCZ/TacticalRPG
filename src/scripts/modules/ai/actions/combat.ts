import Logger from 'modules/logger';
import { IAIData } from 'modules/ai/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';

const btCombat = (): BTAction<IAIData> => {
	return BT.Action(data => {
		if (data.memory.commandConfirmed) {
			return 'SUCCESS';
		}
		data.memory.commandConfirmed = true;

		const { decision } = data.memory;

		if (!decision) {
			Logger.info('AI COMBAT - no command decided');
			return 'SUCCESS';
		}
		const confirm = data.commands.find(cmd => 'CONFIRM' === cmd.type);

		if (!confirm) {
			throw new Error('AI character commands does not contain confirm command');
		}
		const { command } = decision;

		// confirm selected command
		data.selectCommand(confirm);
		Logger.info('AI COMBAT - command confirmed: ' + command.title);

		return 'RUNNING';
	});
};

export default btCombat;
