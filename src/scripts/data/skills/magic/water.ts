import { ISkillData } from 'modules/skill/skill-data';
import { WaterMagicSkillID } from 'modules/skill/magic';

const waterMagic: { [id in WaterMagicSkillID]: ISkillData; } = {
	WAT_SPLASH: {
		title: 'Splash',
		mpCost: 10,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'WATER',
		physical: 0,
		magical: 1
	},
	WAT_SILENCE: {
		title: 'Silence',
		mpCost: 10,
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		element: 'WATER',
		physical: 0,
		magical: 0.5,
		status: ['SILENCE'],
		cooldown: 1
	},
	WAT_FLOOD: {
		title: 'Flood',
		mpCost: 20,
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ENEMY',
		element: 'WATER',
		physical: 0,
		magical: 0.5,
		cooldown: 2
	},
	WAT_WATER_AURA: {
		title: 'Water Aura',
		mpCost: 0,
		type: 'PASSIVE',
		grade: 1,
		range: 0,
		area: 'AOE3x3',
		target: 'SELF',
		element: 'WATER',
		physical: 0,
		magical: 0.25,
		status: ['SILENCE']
	}
};

export default waterMagic;
