import { getRandomItem } from 'core/array';

import { IAIData } from 'modules/ai/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';

const btEvadeTo = (): BTAction<IAIData> => {
	return BT.Action(data => {
		const { act, dangerousTiles } = data;
		const { reaction } = act.phases.REACTION;
		const { effectArea } = act.phases.COMMAND;

		if (!reaction) {
			throw new Error('AI character could not react: invalid reaction');
		}
		let evasible = reaction.evasible.filter(tile => {
			return !tile.isContained(effectArea);
		});

		const safeTiles = evasible.filter(tile => {
			return !tile.isContained(dangerousTiles);
		});

		if (safeTiles.length) {
			evasible = safeTiles;
		}
		const evasionTarget = getRandomItem(evasible);

		if (!evasionTarget) {
			throw new Error('AI character could not react: no evasion target');
		}
		data.selectTile(evasionTarget);

		return 'RUNNING';
	});
};

export default btEvadeTo;
