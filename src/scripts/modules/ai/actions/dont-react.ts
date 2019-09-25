import { IAIData } from 'modules/ai/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';

const btDontReact = (): BTAction<IAIData> => {
	return BT.Action(data => {
		const command = data.act.commands.find(act => 'DONT_REACT' === act.type);

		if (!command) {
			throw new Error('AI character reaction commands does not contain DONT_REACT command');
		}
		data.selectCommand(command.id);

		return 'SUCCESS';
	});
};

export default btDontReact;
