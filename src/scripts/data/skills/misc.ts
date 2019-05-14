import { ISkillData } from 'modules/skill/skill-data';
import { MiscSkillID } from 'modules/skill/misc';

const miscSkills: { [id in MiscSkillID]: ISkillData; } = {
	DOUBLE_ATTACK: {
		title: 'Double Attack',
		cost: 0,
		type: 'ACTIVE',
		range: 'ULTIMATE',
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 0,
		magical: 0,
		cooldown: 1
	},
	DYNAMIC_SKILL: {
		title: '',
		cost: 1,
		type: 'ACTIVE',
		range: 'ULTIMATE',
		area: 'SINGLE',
		target: 'ENEMY',
		physical: 0.5,
		magical: 0.5,
		cooldown: 1
	},
	EVADE: {
		title: 'Evade',
		cost: 4,
		type: 'REACTIVE',
		range: 1,
		area: 'SINGLE',
		physical: 0,
		magical: 0,
	}
};

export default miscSkills;
