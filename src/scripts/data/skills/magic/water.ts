import { ISkillData } from 'modules/skill/skill-data';
import { WaterMagicSkillID } from 'modules/skill/magic';

const waterMagic: { [id in WaterMagicSkillID]: ISkillData; } = {
	WAT_SPLASH: {
		title: 'Splash',
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		cost: {
			MP: 10
		},
		magical: {
			modifier: 1,
			element: 'WATER'
		},
		animation: {
			duration: 1000
		}
	},
	WAT_SILENCE: {
		title: 'Silence',
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		status: ['SILENCE'],
		cooldown: 1,
		cost: {
			MP: 10
		},
		magical: {
			modifier: 0.5,
			element: 'WATER'
		},
		animation: {
			duration: 1000
		}
	},
	WAT_FLOOD: {
		title: 'Flood',
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ENEMY',
		cooldown: 2,
		cost: {
			MP: 20
		},
		magical: {
			modifier: 0.5,
			element: 'WATER'
		},
		animation: {
			duration: 1000
		}
	}
};

export default waterMagic;
