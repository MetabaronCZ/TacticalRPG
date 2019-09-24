import { IAIData } from 'modules/ai/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';

const btResetMemory = (): BTAction<IAIData> => {
	return BT.Action(data => {
		data.memory.decision = null;
		data.memory.hasMoved = false;
		data.memory.commandTargeted = false;
		data.memory.commandSelected = false;
		data.memory.commandConfirmed = false;
		return 'SUCCESS';
	});
};

export default btResetMemory;
