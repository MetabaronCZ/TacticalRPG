import Weapons from 'data/weapons';

import { IAction } from 'modules/ai/actions/decide/actions';
import { meleeWeapons } from 'modules/equipment/weapon-data';
import { getCharacterHPRatio } from 'modules/ai/actions/decide/sort';

// maximum percent of target life remaining for healer to care
const healingTreshold = 0.8;

export interface IActionCategories {
	readonly healing: IAction[];
	readonly melee: IAction[];
	readonly ranged: IAction[];
	readonly magical: IAction[];
	readonly effect: IAction[];
	readonly pass: IAction[];
}

export const getActionCategories = (actions: IAction[]): IActionCategories => {
	const categories: IActionCategories = {
		healing: [],
		melee: [],
		ranged: [],
		magical: [],
		effect: [],
		pass: []
	};
	
	for (const action of actions) {
		const { skills } = action.command;
	
		// handle PASS actions
		if ('PASS' === action.command.type) {
			categories.pass.push(action);
			continue;
		}
	
		if (!skills.length) {
			// only PASS commands can have no skills
			throw new Error('Invalid command: No skills');
		}
	
		// handle healing actions
		if (action.healing > 0) {
			const ratio = getCharacterHPRatio(action.target.character);
	
			if (ratio < healingTreshold) {
				// action has meaningful healing
				categories.healing.push(action);
			}
			continue;
		}
	
		// handle damaging actions
		if (action.damage > 0) {
			const weaponTypes = skills.map(skill => {
				if (!skill.physical) {
					return null;
				}
				const wpn = Weapons.get(skill.physical.weapon);
				return wpn.type;
			});

			const hasRangedSkill = weaponTypes.includes('RANGED');
			const hasMagicalSkill = !!skills.find(skill => !!skill.magical);
			const hasMeleeSkill = !!weaponTypes.find(type => !!type && meleeWeapons.includes(type));
			let categorized = false;
	
			if (hasRangedSkill) {
				categories.ranged.push(action);
				categorized = true;
			}
	
			if (hasMagicalSkill) {
				categories.magical.push(action);
				categorized = true;
			}
	
			if (hasMeleeSkill) {
				categories.melee.push(action);
				categorized = true;
			}
	
			if (!categorized) {
				throw new Error('Invalid AI action categorization: ' + action.command.title);
			}
			continue;
		}
	
		// handle buff / debuff effect actions
		if (action.status.length > 0) {
			categories.effect.push(action);
			continue;
		}
	
		// action has no effect
	}

	return categories;
};
