import { ISkillData } from 'engine/skill/skill-data';
import { WhiteMagicSkillID } from 'engine/skill/magic';

const whiteMagic: { [id in WhiteMagicSkillID]: ISkillData; } = {
	WHITE_MAGIC_HEAL: {
		title: 'Heal',
		cost: 2,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ALLY',
		element: 'HOLY',
		elementalDamage: 1
	},
	WHITE_MAGIC_REMEDY: {
		title: 'Remedy',
		cost: 2,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ALLY',
		element: 'HOLY'
	},
	WHITE_MAGIC_REGENERATE: {
		title: 'Regenerate',
		cost: 2,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ALLY',
		element: 'HOLY',
		elementalDamage: 0.5,
		status: ['REGEN']
	},
	WHITE_MAGIC_GROUP_HEAL: {
		title: 'Group Heal',
		cost: 4,
		type: 'ACTIVE',
		range: 4,
		area: 'AOE3x3',
		target: 'ALLY',
		element: 'HOLY',
		elementalDamage: 0.5
	},
	WHITE_MAGIC_HOLY_AURA: {
		title: 'Holy Aura',
		cost: 0,
		type: 'PASSIVE',
		range: 0,
		area: 'AOE3x3',
		target: 'ALLY',
		element: 'HOLY',
		elementalDamage: 0.25
	},
	WHITE_MAGIC_REVIVE: {
		title: 'Revive',
		cost: 2,
		type: 'ACTIVE',
		range: 4,
		area: 'SINGLE',
		target: 'ALLY',
		element: 'HOLY'
	}
};

export default whiteMagic;