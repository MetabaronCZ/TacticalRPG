import { getRandomItem } from 'core/array';

import { IAIData } from 'modules/ai/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';

const btEvadeTo = (): BTAction<IAIData> => {
	return BT.Action(data => {
		const { reaction } = data.act.phases.REACTION;
		const evasionTarget = (reaction ? getRandomItem(reaction.evasible) : null);

		if (!evasionTarget) {
			throw new Error('AI character could not react: no evasion targets');
		}
		data.selectTile(evasionTarget);

		return 'SUCCESS';
	});
};

export default btEvadeTo;
