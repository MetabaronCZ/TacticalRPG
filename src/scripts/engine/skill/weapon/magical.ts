import { IMagicalWeaponSkillList } from 'engine/skill/weapon/types';
import { SkillRange } from 'engine/skill';

const magicalSkills: IMagicalWeaponSkillList = {
	MACE_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: SkillRange.R1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	STAFF_ATTACK: {
		title: 'Attack',
		cost: 2,
		type: 'ACTIVE',
		range: SkillRange.R1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	}
};

export default magicalSkills;
