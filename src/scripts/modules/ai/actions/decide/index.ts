import Logger from 'modules/logger';

import BT from 'modules/ai/behavioral-tree';
import CharacterRole from 'modules/ai/role';
import { IAIData } from 'modules/ai/character';
import BTAction from 'modules/ai/behavioral-tree/action';

import { getRoleAction } from 'modules/ai/actions/decide/role';
import { getPassAction } from 'modules/ai/actions/decide/pass';
import { getCriticalAction } from 'modules/ai/actions/decide/critical';
import { getActions, IAction } from 'modules/ai/actions/decide/actions';
import { getActionCategories } from 'modules/ai/actions/decide/categories';

const btDecide = (role: CharacterRole): BTAction<IAIData> => {
	return BT.Action(data => {
		if (data.memory.decision) {
			return 'SUCCESS';
		}
		const { act, ally, characters } = data;
		const { actor } = act;

		// gather all possible actions
		const actions = getActions(data);

		// categorize actions
		const categories = getActionCategories(actions);
		const passActions = categories.pass;

		if (!passActions.length) {
			throw new Error('Invalid AI commands: no pass action found');
		}
		let action: IAction | null = null;

		if ('CRITICAL' === actor.condition) {
			action = getCriticalAction(actor, ally, characters, categories, role);
		}

		if (!action) {
			action = getRoleAction(categories, role);
		}

		if (!action) {
			action = getPassAction(act.actor, role.primary, passActions);
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
