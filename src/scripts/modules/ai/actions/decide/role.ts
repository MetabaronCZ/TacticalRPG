import Logger from 'modules/logger';
import { CharacterRoleID } from 'modules/ai/role';
import { IAction } from 'modules/ai/actions/decide/actions';
import { sortActions } from 'modules/ai/actions/decide/sort';
import { IActionCategories } from 'modules/ai/actions/decide/categories';

// get action according to actor role
export const getRoleAction = (categories: IActionCategories, roles: CharacterRoleID[]): IAction | null => {
	const healingActions = categories.healing;
	const magicalActions = categories.magical;
	const rangedActions = categories.ranged;
	const meleeActions = categories.melee;

	for (const r of roles) {
		switch (r) {
			case 'HEALER': {
				if (!healingActions.length) {
					// cant do any meaningful healing
					continue;
				}
				let act: IAction[] = [...healingActions];

				act = sortActions(act, [
					'HP_REMAINING', 'MOST_HEALING', 'SAFE_DISTANCE'
				]);

				// optimal healing action
				Logger.info('AI DECIDE: HEALER healing');
				return act[0];
			}

			case 'MELEE': {
				if (!meleeActions.length) {
					// cant do any melee damage
					continue;
				}
				let act: IAction[] = [...meleeActions];

				act = sortActions(act, [
					'HP_REMAINING', 'MOST_DAMAGE', 'SHORTEST_TRAVEL'
				], true);

				// optimal melee damage action
				Logger.info('AI DECIDE: MELEE attack');
				return act[0];
			}

			case 'RANGER': {
				if (!rangedActions.length) {
					// cant do any ranged damage
					continue;
				}
				let act: IAction[] = [...rangedActions];

				act = sortActions(act, [
					'HP_REMAINING', 'MOST_DAMAGE', 'SAFE_DISTANCE'
				], true);

				// optimal ranged damage action
				Logger.info('AI DECIDE: RANGER attack');
				return act[0];
			}

			case 'MAGE': {
				if (!magicalActions.length) {
					// cant do any magical damage
					continue;
				}
				let act: IAction[] = [...magicalActions];

				act = sortActions(act, [
					'HP_REMAINING', 'MOST_DAMAGE', 'SAFE_DISTANCE'
				], true);

				// optimal magical damage action
				Logger.info('AI DECIDE: MAGE attack');
				return act[0];
			}

			default:
				throw new Error('Invalid character role: ' + r);
		}
	}
	return null;
};
