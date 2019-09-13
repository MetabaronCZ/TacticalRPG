import { IAIData } from 'modules/ai/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';

const btEvade = (): BTAction<IAIData> => {
	return BT.Action(data => {
		const evadeCommand = data.commands.find(cmd => {
			return (
				cmd.isActive() &&
				cmd.skills.length &&
				'EVADE' === cmd.skills[0].id
			);
		});

		if (!evadeCommand) {
			return 'FAILURE';
		}
		data.selectCommand(evadeCommand);
		return 'SUCCESS';
	});
};

export default btEvade;
