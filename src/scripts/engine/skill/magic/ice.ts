import { IIceMagicSkillList, MagicSkillID } from 'engine/skill/magic/types';
import { ISkillset } from 'engine/skillset';
import { SkillRange } from 'engine/skill';

const iceMagic: IIceMagicSkillList = {
	ICE_MAGIC_ICE_SPEAR: {
		title: 'Ice Spear',
		cost: 2,
		type: 'ACTIVE',
		range: SkillRange.R4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'ICE',
		physicalDamage: 0.5,
		elementalDamage: 1
	},
	ICE_MAGIC_FREEZE: {
		title: 'Freeze',
		cost: 2,
		type: 'ACTIVE',
		range: SkillRange.R4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'ICE',
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: ['FREEZE']
	},
	ICE_MAGIC_BLIZZARD: {
		title: 'Blizzard',
		cost: 4,
		type: 'ACTIVE',
		range: SkillRange.R4,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'ICE',
		physicalDamage: 0.25,
		elementalDamage: 0.5
	},
	ICE_MAGIC_FROST_AURA: {
		title: 'Frost Aura',
		cost: 0,
		type: 'PASSIVE',
		range: SkillRange.R1,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'ICE',
		elementalDamage: 0.25,
		status: ['FREEZE']
	}
};

export const iceMagicSkillset: ISkillset = {
	title: 'Ice Magic',
	description: '',
	element: 'ICE',
	skills: Object.keys(iceMagic) as MagicSkillID[]
};

export default iceMagic;
