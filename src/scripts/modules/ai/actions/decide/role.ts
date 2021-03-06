import Logger from 'modules/logger';
import CharacterRole from 'modules/ai/role';
import { IAction } from 'modules/ai/actions/decide/actions';
import { IActionCategories } from 'modules/ai/actions/decide/categories';
import { sortActions, getCharacterHPRatio } from 'modules/ai/actions/decide/sort';

// get action according to actor role
export const getRoleAction = (categories: IActionCategories, role: CharacterRole): IAction | null => {
	const healingActions = categories.healing;
	const magicalActions = categories.magical;
	const rangedActions = categories.ranged;
	const meleeActions = categories.melee;
	const allActions = categories.all;

	for (const r of role.get()) {
		switch (r) {
			case 'HEALER': {
				if (healingActions.length) {
					let act: IAction[] = [...healingActions];

					act = sortActions(act, [
						'HP_REMAINING', 'MOST_HEALING', 'SAFE_DISTANCE', 'SHORTEST_TRAVEL'
					]);
	
					// optimal healing action
					Logger.info('AI DECIDE: HEALER - healing');
					return act[0];
				}

				// get revive actions
				const reviveActions = allActions.filter(act => {
					const skills = act.command.skills.map(skill => skill.id);
					return skills.includes('HOL_REVIVE');
				});

				if (reviveActions.length) {
					const act = sortActions(reviveActions, [
						'SAFE_DISTANCE', 'SHORTEST_TRAVEL'
					]);

					// revive character
					Logger.info('AI DECIDE: HEALER - revive ally');
					return act[0];
				}

				// cant do any meaningful HEALER action
				break;
			}

			case 'MELEE': {
				if (!meleeActions.length) {
					// cant do any melee damage
					continue;
				}
				let act: IAction[] = [...meleeActions];

				act = sortActions(
					act,
					['HP_REMAINING', 'MOST_DAMAGE', 'SHORTEST_TRAVEL'],
					[true]
				);

				// optimal melee damage action
				Logger.info('AI DECIDE: MELEE - attack');
				return act[0];
			}

			case 'RANGER': {
				if (!rangedActions.length) {
					// cant do any ranged damage
					continue;
				}
				let act: IAction[] = [...rangedActions];

				const killAttempts = act.filter(a => {
					const hpRemaining = getCharacterHPRatio(a.target.character, a.damage);
					return 0 === hpRemaining;
				});

				if (killAttempts.length) {
					act = sortActions(killAttempts, [
						'SAFE_DISTANCE', 'SHORTEST_TRAVEL'
					]);
					Logger.info('AI DECIDE: RANGER - kill attempt');

				} else {
					act = sortActions(act, [
						'SAFE_DISTANCE', 'MOST_DAMAGE', 'SHORTEST_TRAVEL'
					]);
					Logger.info('AI DECIDE: RANGER - attack');
				}

				// optimal ranged damage action
				return act[0];
			}

			case 'MAGE': {
				if (!magicalActions.length) {
					// cant do any magical damage
					continue;
				}
				let act: IAction[] = [...magicalActions];

				const killAttempts = act.filter(a => {
					const hpRemaining = getCharacterHPRatio(a.target.character, a.damage);
					return 0 === hpRemaining;
				});

				if (killAttempts.length) {
					act = sortActions(killAttempts, [
						'SAFE_DISTANCE', 'SHORTEST_TRAVEL'
					]);
					Logger.info('AI DECIDE: MAGE - kill attempt');

				} else {
					act = sortActions(act, [
						'SAFE_DISTANCE', 'MOST_DAMAGE', 'SHORTEST_TRAVEL'
					]);
					Logger.info('AI DECIDE: MAGE - attack');
				}

				// optimal magical damage action
				return act[0];
			}

			default:
				throw new Error('Invalid character role: ' + r);
		}
	}

	Logger.info('AI DECIDE: ROLE - no specific action found');
	return null;
};
