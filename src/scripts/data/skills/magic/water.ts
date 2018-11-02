import { ISkillData } from 'modules/skill/skill-data';
import { WaterMagicSkillID } from 'modules/skill/magic';

const waterMagic: { [id in WaterMagicSkillID]: ISkillData; } = {
	WATER_MAGIC_SPLASH: {
		title: 'Splash',
		cost: 2,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
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
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'WATER',
		physicalDamage: 0.25,
		elementalDamage: 0.25,
		status: ['SILENCE'],
		cooldown: 1
	},
	WATER_MAGIC_FLOOD: {
		title: 'Flood',
		cost: 4,
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'WATER',
		physicalDamage: 0.25,
		elementalDamage: 0.5,
		cooldown: 2
	},
	WATER_MAGIC_WATER_AURA: {
		title: 'Water Aura',
		cost: 0,
		type: 'PASSIVE',
		grade: 1,
		range: 0,
		area: 'AOE3x3',
		target: 'SELF',
		element: 'WATER',
		elementalDamage: 0.25,
		status: ['SILENCE']
	}
};

export default waterMagic;
