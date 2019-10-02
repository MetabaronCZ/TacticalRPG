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
		magical: 1,
		animation: {
			duration: 1000
		}
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
		cooldown: 1,
		status: ['SILENCE'],
		animation: {
			duration: 1000
		}
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
		cooldown: 2,
		animation: {
			duration: 1000
		}
	}
};

export default waterMagic;
