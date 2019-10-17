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
			element: 'HOLY'
		},
		animation: {
			duration: 0
		}
	}
};

export default miscSkills;
