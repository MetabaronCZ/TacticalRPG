import { IAIData } from 'modules/ai/character';

import BT from 'modules/ai/behavioral-tree';
import BTAction from 'modules/ai/behavioral-tree/action';

const btEvade = (): BTAction<IAIData> => {
	return BT.Action(data => {
		const evadeCommand = data.act.commands.find(cmd => {
			return (
				cmd.isActive &&
				cmd.skills.length &&
				'EVADE' === cmd.skills[0].id
			);
		});

		if (!evadeCommand) {
			return 'FAILURE';
		}
		const { reaction } = data.act.phases.REACTION;
		const { effectArea } = data.act.phases.COMMAND;

		if (!reaction) {
			throw new Error('AI character could not evade: invalid reaction');
		}
		const evasible = reaction.evasible.find(tile => !tile.isContained(effectArea));

		if (!evasible) {
			return 'FAILURE';
		}
		data.selectCommand(evadeCommand.id);
		return 'SUCCESS';
	});
};

export default btEvade;
