import { IAIData } from 'modules/ai/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';

const btPass = (): BTAction<IAIData> => {
	return BT.Action(data => {
		const passCommand = data.commands.find(act => 'PASS' === act.type);

		if (!passCommand) {
			throw new Error('AI character commands does not contain pass command');
		}
		data.selectCommand(passCommand);
		return 'SUCCESS';
	});
};

export default btPass;
