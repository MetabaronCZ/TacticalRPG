import { IWaterMagicSkillList, MagicSkillID } from 'engine/skill/magic/types';
import { ISkillset } from 'engine/skillset';
import { SkillRange } from 'engine/skill';

const waterMagic: IWaterMagicSkillList = {
	WATER_MAGIC_SPLASH: {
		title: 'Splash',
		cost: 2,
		type: 'ACTIVE',
		range: SkillRange.R4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'WATER',
		physicalDamage: 0.5,
		elementalDamage: 1
	},
	WATER_MAGIC_SILENCE: {
		title: 'Silence',
		cost: 2,
		type: 'ACTIVE',
		range: SkillRange.R4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'WATER',
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: ['SILENCE']
	},
	WATER_MAGIC_FLOOD: {
		title: 'Flood',
		cost: 4,
		type: 'ACTIVE',
		range: SkillRange.R4,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'WATER',
		physicalDamage: 0.25,
		elementalDamage: 0.5
	},
	WATER_MAGIC_WATER_AURA: {
		title: 'Water Aura',
		cost: 0,
		type: 'PASSIVE',
		range: SkillRange.R0,
		area: 'AOE3x3',
		target: 'SELF',
		element: 'WATER',
		elementalDamage: 0.25,
		status: ['SILENCE']
	}
};

export const waterMagicSkillset: ISkillset = {
	title: 'Water Magic',
	description: '',
	element: 'WATER',
	skills: Object.keys(waterMagic) as MagicSkillID[]
};

export default waterMagic;