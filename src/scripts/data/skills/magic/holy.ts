import { ISkillData } from 'modules/skill/skill-data';
import { HolyMagicSkillID } from 'modules/skill/magic';

const holyMagic: { [id in HolyMagicSkillID]: ISkillData; } = {
	HOL_HEAL: {
		title: 'Heal',
		cost: 2,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ALLY',
		element: 'HOLY',
		physical: 0,
		magical: 1
	},
	HOL_REMEDY: {
		title: 'Remedy',
		cost: 2,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ALLY',
		element: 'HOLY',
		physical: 0,
		magical: 0
	},
	HOL_REGENERATE: {
		title: 'Regenerate',
		cost: 2,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ALLY',
		element: 'HOLY',
		physical: 0,
		magical: 0.5,
		status: ['REGEN'],
		cooldown: 1
	},
	HOL_GROUP_HEAL: {
		title: 'Group Heal',
		cost: 4,
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ALLY',
		element: 'HOLY',
		physical: 0,
		magical: 0.5,
		cooldown: 2
	},
	HOL_HOLY_AURA: {
		title: 'Holy Aura',
		cost: 0,
		type: 'PASSIVE',
		grade: 1,
		range: 0,
		area: 'AOE3x3',
		target: 'ALLY',
		element: 'HOLY',
		physical: 0,
		magical: 0.25
	},
	HOL_REVIVE: {
		title: 'Revive',
		cost: 2,
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'SINGLE',
		target: 'ALLY',
		element: 'HOLY',
		physical: 0,
		magical: 0,
		cooldown: 'ULTIMATE'
	}
};

export default holyMagic;
