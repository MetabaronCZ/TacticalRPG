import { ISkillData } from 'modules/skill/skill-data';
import { MiscSkillID } from 'modules/skill/misc';

const miscSkills: { [id in MiscSkillID]: ISkillData; } = {
	DOUBLE_ATTACK: {
		title: 'Double Attack',
		type: 'ACTIVE',
		range: 'ULTIMATE',
		area: 'SINGLE',
		target: 'ENEMY',
		cooldown: 1,
		cost: {},
		animation: {
			duration: 0
		}
	},
	DYNAMIC_SKILL: {
		title: '',
		type: 'ACTIVE',
		grade: 1,
		range: 'ULTIMATE',
		area: 'SINGLE',
		target: 'ENEMY',
		cooldown: 1,
		cost: {
			MP: 5
		},
		magical: {
			modifier: 0.5,
			element: 'NONE'
		},
		animation: {
			duration: 0
		}
	},
	EVADE: {
		title: 'Evade',
		type: 'REACTIVE',
		range: 1,
		area: 'SINGLE',
		cost: {
			AP: 4
		},
		animation: {
			duration: 150
		}
	},
	ENERGY_SHIELD: {
		title: 'Energy Shield',
		type: 'REACTIVE',
		range: 0,
		area: 'SINGLE',
		target: 'SELF',
		status: ['ENERGY_SHIELD'],
		cost: {},
		animation: {
			duration: 150
		}
	}
};

export default miscSkills;
