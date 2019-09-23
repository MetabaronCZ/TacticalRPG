import { ISkillData } from 'modules/skill/skill-data';
import { MiscSkillID } from 'modules/skill/misc';

const miscSkills: { [id in MiscSkillID]: ISkillData; } = {
	DOUBLE_ATTACK: {
		title: 'Double Attack',
		apCost: 0,
		type: 'ACTIVE',
		range: 'ULTIMATE',
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 0,
		magical: 0,
		cooldown: 1,
		animation: {
			duration: 0
		}
	},
	DYNAMIC_SKILL: {
		title: '',
		apCost: 0,
		mpCost: 5,
		type: 'ACTIVE',
		grade: 1,
		range: 'ULTIMATE',
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 0,
		magical: 0.5,
		cooldown: 1,
		animation: {
			duration: 0
		}
	},
	EVADE: {
		title: 'Evade',
		apCost: 4,
		type: 'REACTIVE',
		range: 1,
		area: 'SINGLE',
		physical: 0,
		magical: 0,
		animation: {
			duration: 150
		}
	},
	ENERGY_SHIELD: {
		title: 'Energy Shield',
		apCost: 0,
		type: 'REACTIVE',
		range: 0,
		area: 'SINGLE',
		target: 'SELF',
		physical: 0,
		magical: 0,
		status: ['ENERGY_SHIELD'],
		animation: {
			duration: 150
		}
	}
};

export default miscSkills;
