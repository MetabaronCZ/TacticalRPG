import Logger from 'modules/logger';
import { IAIData } from 'modules/ai/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';

const btCommand = (): BTAction<IAIData> => {
	return BT.Action(data => {
		if (data.memory.commandSelected) {
			Logger.info('AI COMMAND - command already selected');
			return 'SUCCESS';
		}
		data.memory.commandSelected = true;

		const passCommand = data.commands.find(cmd => 'PASS' === cmd.type);
		const { decision } = data.memory;

		if (!passCommand) {
			throw new Error('AI character commands does not contain pass command');
		}

		if (!decision) {
			data.selectCommand(passCommand);
			Logger.info('AI COMMAND - no command decided');

		} else {
			const { command } = decision;
			data.selectCommand(command);
			Logger.info('AI COMMAND - command selected: ' + command.title);
		}
		return 'SUCCESS';
	});
};

export default btCommand;
