import Logger from 'modules/logger';
import { ICharacterSnapshot } from 'modules/character';

import CharacterRole from 'modules/ai/role';
import { IAction } from 'modules/ai/actions/decide/actions';
import { sortActions } from 'modules/ai/actions/decide/sort';
import { IActionCategories } from 'modules/ai/actions/decide/categories';

type ActionTableType = 'STUN' | 'DISABLE' | 'DOT' | 'OTHER';

type IActionTable = {
	[type in ActionTableType]: IAction[];
}

// get action according to actor role
export const getEffectAction = (actor: ICharacterSnapshot, categories: IActionCategories, role: CharacterRole): IAction | null => {
	const effectActions = categories.effect;
	const allActions = categories.all;

	if (!effectActions.length) {
		Logger.info('AI DECIDE: EFFECT - no effect actions');
		return null;
	}

	for (const r of role.get()) {
		switch (r) {
			case 'HEALER': {
				// get actions which dispels harmful status effect
				const dispelable = allActions.filter(act => {
					const debuffs = act.target.character.status.filter(st => !st.buff);
					const skills = act.command.skills.map(skill => skill.id);
					return (skills.includes('HOL_REMEDY') && debuffs.length);
				});

				if (dispelable.length) {
					// dispel debuffs
					const act = sortActions(dispelable, [
						'SAFE_DISTANCE', 'SHORTEST_TRAVEL'
					]);
	
					Logger.info('AI DECIDE: HEALER - dispel debuff');
					return act[0];
				}

				// find injured targets to use REGEN on them
				const rejuvenable = effectActions.filter(act => {
					const tgtStatus = act.target.character.status.map(st => st.id);
					return act.status.includes('REGEN') && !tgtStatus.includes('REGEN');
				});

				if (rejuvenable.length) {
					// cast regen to injured targets
					const act = sortActions(rejuvenable, [
						'SAFE_DISTANCE', 'SHORTEST_TRAVEL'
					]);
	
					Logger.info('AI DECIDE: HEALER - regenerate target');
					return act[0];
				}

				// no HEALER effect applicable
				break;
			}

			case 'MELEE':
			case 'RANGER':
			case 'MAGE': {
				const applicable = effectActions.filter(act => {
					const tgtStatus = act.target.character.status.map(st => st.id);
					return !!act.status.find(st => !tgtStatus.includes(st));
				});

				if (!applicable.length) {
					// no applicable status found
					continue;
				}
				const actionTable: IActionTable = {
					STUN: [],
					DISABLE: [],
					DOT: [],
					OTHER: []
				};

				// categorize effect actions
				for (const action of applicable) {
					const { status, target } = action;
					const tgt = target.character;
					const tgtStatus = target.character.status.map(st => st.id);

					const tgtIsMage = (null !== tgt.skillset.element);
					const tgtIsAgile = ('SS' === tgt.archetype);
					const tgtCanAct = (!tgtStatus.includes('STUN') && !tgtStatus.includes('FREEZE'));

					if ((status.includes('STUN') || status.includes('FREEZE')) && tgtCanAct) {
						actionTable.STUN.push(action);
					}

					if (status.includes('SILENCE') && tgtIsMage) {
						actionTable.DISABLE.push(action);
					}

					if (status.includes('DISARM') && !tgtIsMage) {
						actionTable.DISABLE.push(action);
					}

					if (status.includes('CRIPPLE') && tgtIsAgile) {
						actionTable.DISABLE.push(action);
					}

					if (status.includes('BLEED') || status.includes('BURN')) {
						actionTable.DOT.push(action);
					}

					if (status.includes('SHOCK') || status.includes('CONFUSION')) {
						actionTable.OTHER.push(action);
					}
				}
				let actions: IAction[] = [];

				// try to stun target
				if (actionTable.STUN.length) {
					actions = actionTable.STUN;
				}

				// try to disable target
				if (!actions.length && actionTable.DISABLE.length) {
					actions = actionTable.DISABLE;
				}

				// try to apply DoT effects
				if (!actions.length && actionTable.DOT.length) {
					actions = actionTable.DOT;
				}

				// try to apply other status effects
				if (!actions.length && actionTable.OTHER.length) {
					actions = actionTable.OTHER;
				}

				if (actions.length) {
					let act: IAction[];

					if ('MELEE' === r) {
						act = sortActions(actions, ['SHORTEST_TRAVEL']);
					} else {
						act = sortActions(actions, ['SAFE_DISTANCE', 'SHORTEST_TRAVEL']);
					}

					Logger.info('AI DECIDE: DAMAGE DEALER - debuff target');
					return act[0];
				}

				// no debuff applicable
				break;
			}

			default:
				throw new Error('Invalid character role: ' + r);
		}
	}

	Logger.info('AI DECIDE: EFFECT - no specific action found');
	return null;
};
