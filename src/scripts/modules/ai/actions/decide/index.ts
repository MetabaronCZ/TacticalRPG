import Logger from 'modules/logger';

import CharacterRole from 'modules/ai/role';
import BT from 'modules/ai/behavioral-tree';
import { IAIData } from 'modules/ai/character';
import BTAction from 'modules/ai/behavioral-tree/action';
import { getActions } from 'modules/ai/actions/decide/actions';
import { getRoleAction } from 'modules/ai/actions/decide/role';
import { getPassAction } from 'modules/ai/actions/decide/pass';
import { getActionCategories } from 'modules/ai/actions/decide/categories';

const btDecide = (role: CharacterRole): BTAction<IAIData> => {
	return BT.Action(data => {
		if (data.memory.decision) {
			return 'SUCCESS';
		}
		const { act, ally, enemy } = data;
		const characters = ally.concat(enemy).filter(char => !char.dead && !char.dying);

		// gather all possible actions
		const actions = getActions(data);

		// categorize actions
		const categories = getActionCategories(actions);
		const passActions = categories.pass;

		if (!passActions.length) {
			throw new Error('Invalid AI commands: no pass action found');
		}
		const roles = role.get();
		let action = getRoleAction(categories, roles);

		if (!action) {
			action = getPassAction(act.actor, roles[0], passActions);
		}

		if (!action) {
			throw new Error('AI could not decide any action');
		}
		const { target, move, command } = action;
		const { position } = target;

		data.memory.decision = {
			move,
			command,
			target: position
		};
		const char = characters.find(char => position === char.position);

		Logger.info(`AI DECIDE - target: ${char ? char.name + ' ' : ''}${position.id}`);
		Logger.info(`AI DECIDE - move: ${move.id}`);
		Logger.info(`AI DECIDE - command: ${command.title}`);

		return 'SUCCESS';
	});
};

export default btDecide;
