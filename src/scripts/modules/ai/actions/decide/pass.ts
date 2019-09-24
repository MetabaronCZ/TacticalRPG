import Logger from 'modules/logger';
import { CharacterRoleID } from 'modules/ai/role';
import * as sort from 'modules/ai/actions/decide/sort';
import { ICharacterSnapshot } from 'modules/character';
import { IAction } from 'modules/ai/actions/decide/actions';

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

	if ('HEALER' === primaryRole[0]) {
		// get injured targets
		const injured = allyActions.filter(action => {
			return 'OK' !== action.target.character.condition;
		});

		if (injured.length) {
			// go to closest injured ally
			let results = [...injured];
			results = sort.bySafeDistance(results);
			results = sort.byShortestTravel(results);

			result = results[0];
			Logger.info('AI DECIDE - HEALER go to closest injured');

		} else {
			// keep out of harm
			const actorMove = actor.attributes.MOV;
			const approachable = actions.filter(action => action.closestAlly - 2 <= actorMove);

			if (approachable.length) {
				// stay in emergency distance
				let results = [...approachable];
				results = sort.bySafeDistance(results);

				result = results[0];
				Logger.info('AI DECIDE - HEALER stay in emergency distance');

			} else {
				// go closer to allies
				let results = [...actions];
				results = sort.bySafeDistance(results);
				results = sort.byAllyDistance(results);

				result = results[0];
				Logger.info('AI DECIDE - HEALER keep close to allies');
			}
		}

	} else {
		// go to closest enemy
		let results = [...enemyActions];
		results = sort.byShortestTravel(results);

		result = results[0];
		Logger.info('AI DECIDE - DAMAGE DEALER go to closest enemy');
	}

	return result || null;
};
