import { IAIData } from 'modules/ai/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';
import { getRandomItem } from 'core/array';

const btEvadeTo = (): BTAction<IAIData> => {
	return BT.Action(data => {
		const { reaction } = data.act.phases.REACTION;
		const { effectArea } = data.act.phases.COMMAND;

		if (!reaction) {
			throw new Error('AI character could not react: invalid reaction');
		}
		const evasible = reaction.evasible.filter(tile => {
			return !tile.isContained(effectArea);
		});

		const evasionTarget = getRandomItem(evasible);

		if (!evasionTarget) {
			throw new Error('AI character could not react: no evasion target');
		}
		data.selectTile(evasionTarget);

		return 'RUNNING';
	});
};

export default btEvadeTo;
