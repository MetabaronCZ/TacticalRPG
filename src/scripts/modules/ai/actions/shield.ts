import { IAIData } from 'modules/ai/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';

const btShield = (): BTAction<IAIData> => {
	return BT.Action(data => {
		const shieldCommand = data.commands.find(cmd => {
			return (
				cmd.isActive() &&
				cmd.skills.length &&
				'ENERGY_SHIELD' === cmd.skills[0].id
			);
		});

		if (!shieldCommand) {
			return 'FAILURE';
		}
		data.selectCommand(shieldCommand);
		return 'SUCCESS';
	});
};

export default btShield;
