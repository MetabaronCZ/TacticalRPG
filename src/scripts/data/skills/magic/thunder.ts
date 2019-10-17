import { ISkillData } from 'modules/skill/skill-data';
import { ThunderMagicSkillID } from 'modules/skill/magic';

const thunderMagic: { [id in ThunderMagicSkillID]: ISkillData; } = {
	THU_THUNDERBOLT: {
		title: 'Thunderbolt',
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
			element: 'THUNDER'
		},
		animation: {
			duration: 1000
		}
	},
	THU_SHOCK: {
		title: 'Shock',
		type: 'ACTIVE',
		grade: 1,
		range: 4,
		area: 'SINGLE',
		target: 'ENEMY',
		status: ['SHOCK'],
		cooldown: 1,
		cost: {
			MP: 10
		},
		magical: {
			modifier: 0.5,
			element: 'THUNDER'
		},
		animation: {
			duration: 1000
		}
	},
	THU_THUNDERSTORM: {
		title: 'Thunderstorm',
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
			element: 'THUNDER'
		},
		animation: {
			duration: 1000
		}
	}
};

export default thunderMagic;
