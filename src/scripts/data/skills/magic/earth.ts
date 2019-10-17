import { ISkillData } from 'modules/skill/skill-data';
import { EarthMagicSkillID } from 'modules/skill/magic';

const earthMagic: { [id in EarthMagicSkillID]: ISkillData; } = {
	ERT_BOULDER: {
		title: 'Boulder',
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
			element: 'EARTH'
		},
		animation: {
			duration: 1000
		}
	},
	ERT_EARTH_SPIKE: {
		title: 'Earth Spike',
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		status: ['STUN'],
		cooldown: 1,
		cost: {
			MP: 10
		},
		magical: {
			modifier: 0.5,
			element: 'EARTH'
		},
		animation: {
			duration: 1000
		}
	},
	ERT_EARTHQUAKE: {
		title: 'Earthquake',
		type: 'ACTIVE',
		grade: 2,
		range: 4,
		area: 'AOE3x3',
		target: 'ENEMY',
		status: [],
		cooldown: 2,
		cost: {
			MP: 20
		},
		magical: {
			modifier: 0.5,
			element: 'EARTH'
		},
		animation: {
			duration: 1000
		}
	}
};

export default earthMagic;
