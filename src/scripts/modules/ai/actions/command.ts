import Logger from 'modules/logger';
import { IAIData } from 'modules/ai/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';

const btCommand = (): BTAction<IAIData> => {
	return BT.Action(data => {
		if (data.memory.commandSelected) {
			return 'SUCCESS';
		}
		data.memory.commandSelected = true;

		const passCommand = data.act.commands.find(cmd => 'PASS' === cmd.type);
		const { decision } = data.memory;

		if (!passCommand) {
			throw new Error('AI character commands does not contain pass command');
		}

		if (!decision) {
			data.selectCommand(passCommand.id);
			Logger.info('AI COMMAND - no command decided');

		} else {
			const { command } = decision;
			data.selectCommand(command.id);
			Logger.info('AI COMMAND - command selected: ' + command.title);
		}
		return 'SUCCESS';
	});
};

export default btCommand;
