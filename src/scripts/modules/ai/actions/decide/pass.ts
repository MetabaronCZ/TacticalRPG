import Logger from 'modules/logger';
import { CharacterRoleID } from 'modules/ai/role';
import { ICharacterSnapshot } from 'modules/character';
import { IAction } from 'modules/ai/actions/decide/actions';
import { sortActions } from 'modules/ai/actions/decide/sort';

// find best available move-and-pass action
export const getPassAction = (actor: ICharacterSnapshot, primaryRole: CharacterRoleID, actions: IAction[]): IAction | null => {
	if (!actions.length) {
		return null;
	}
	const allyActions = actions.filter(action => {
		return actor.player.id === action.target.character.player.id;
	});

	const enemyActions = actions.filter(action => {
		return actor.player.id !== action.target.character.player.id;
	});

	if (!enemyActions.length) {
		throw new Error('AI could not decide action: No enemy');
	}
	let result: IAction | null = null;

	if ('HEALER' === primaryRole) {
		// get injured targets
		const injured = allyActions.filter(action => {
			return 'OK' !== action.target.character.condition;
		});

		if (injured.length) {
			// go to closest injured ally
			let results = [...injured];

			results = sortActions(results, ['SHORTEST_TRAVEL', 'SAFE_DISTANCE']);
			result = results[0];

			Logger.info('AI DECIDE: HEALER - go to closest injured');

		} else {
			// keep out of harm
			const actorMove = actor.attributes.MOV;
			const approachable = actions.filter(action => action.closestAlly - 2 <= actorMove);

			if (approachable.length) {
				// stay in emergency distance
				let results = [...approachable];

				results = sortActions(results, ['SAFE_DISTANCE']);
				result = results[0];

				Logger.info('AI DECIDE: HEALER - stay in emergency distance');

			} else {
				// go closer to allies
				let results = [...actions];

				results = sortActions(results, ['ALLY_DISTANCE', 'SAFE_DISTANCE']);
				result = results[0];

				Logger.info('AI DECIDE: HEALER - keep close to allies');
			}
		}

	} else {
		// go to closest enemy
		let results = [...enemyActions];

		results = sortActions(results, ['SHORTEST_TRAVEL']);
		result = results[0];

		Logger.info('AI DECIDE: DAMAGE DEALER - go to closest enemy');
	}

	return result || null;
};
