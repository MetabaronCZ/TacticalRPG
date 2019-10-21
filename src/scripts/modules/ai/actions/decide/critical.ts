import Logger from 'modules/logger';
import CharacterRole from 'modules/ai/role';
import { ICharacterSnapshot } from 'modules/character';
import { IAction } from 'modules/ai/actions/decide/actions';
import { sortActions } from 'modules/ai/actions/decide/sort';
import { IActionCategories } from 'modules/ai/actions/decide/categories';
import { IAICharacterSnapshot } from 'modules/ai/character';

interface IHealerInfo {
	readonly actions: IAction[];
	readonly distance: number;
}

// get action in CRITICAL character state
export const getCriticalAction = (actor: ICharacterSnapshot, ally: IAICharacterSnapshot[], characters: ICharacterSnapshot[], categories: IActionCategories, role: CharacterRole): IAction | null => {
	const healingActions = categories.healing;

	// try to self-heal
	if (healingActions.length) {
		let act = healingActions.filter(action => actor.id === action.target.character.id);
			
		if (act.length) {
			if ('MELEE' === role.primary) {
				// heal and save AP for reaction skills
				act = sortActions(act, ['MOST_HEALING', 'SHORTEST_TRAVEL']);

			} else {
				// heal and keep distance
				act = sortActions(act, ['MOST_HEALING', 'SAFE_DISTANCE']);
			}

			// optimal self-heal
			Logger.info('AI DECIDE: CRITICAL - self-healing');
			return act[0];
		}
	}
	const alliedHealers = characters.filter(char => {
		if (char.dead || char.dying) {
			return false;
		}

		if (actor.id === char.id || char.player.id !== actor.player.id) {
			return false;
		}
		const data = ally.find(a => char.id === a.id);

		if (!data) {
			throw new Error('Invalid AI data for character: ' + char.name);
		}
		return 'HEALER' === data.role.primary;
	});

	// goto closest healer
	if (alliedHealers.length) {
		let healerInfo: IHealerInfo[] = [];

		// get healer actions
		for (const char of alliedHealers) {
			const healerID = char.id;

			// sort by distance to healer
			let act = [...categories.all];
			act = sortActions(act, ['CLOSEST_TO'], [healerID]);

			// get all actions in same distance from healer
			const distance = act[0].distances[healerID];
			const actions = act.filter(action => distance === action.distances[healerID]);

			healerInfo.push({ actions, distance });
		}

		// get actions closest to healer
		healerInfo = healerInfo.sort((a, b) => a.distance - b.distance);

		const act = sortActions(healerInfo[0].actions, ['SAFE_DISTANCE', 'MOST_DAMAGE']);

		Logger.info('AI DECIDE: CRITICAL - goto healer');
		return act[0];
	}

	Logger.info('AI DECIDE: CRITICAL - no specific action found');
	return null;
};
