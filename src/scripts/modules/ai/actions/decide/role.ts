import { CharacterRoleID } from 'modules/ai/role';
import * as sort from 'modules/ai/actions/decide/sort';
import { IAction } from 'modules/ai/actions/decide/actions';
import { IActionCategories } from 'modules/ai/actions/decide/categories';
import Logger from 'modules/logger';

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

				// sort actions (prioritized)
				act = sort.bySafeDistance(act);
				act = sort.byMostHealing(act);
				act = sort.byHPRemaining(act, false);

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

				// sort actions (prioritized)
				act = sort.byShortestTravel(act);
				act = sort.byMostDamage(act);
				act = sort.byHPRemaining(act, true);

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

				// sort actions (prioritized)
				act = sort.bySafeDistance(act);
				act = sort.byMostDamage(act);
				act = sort.byHPRemaining(act, true);

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

				// sort actions (prioritized)
				act = sort.bySafeDistance(act);
				act = sort.byMostDamage(act);
				act = sort.byHPRemaining(act, true);

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
