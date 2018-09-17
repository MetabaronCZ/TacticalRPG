import { ISkillData } from 'engine/skill/skill-data';
import { MagicalWeaponSkillID } from 'engine/skill/weapon';

const magicalSkills: { [id in MagicalWeaponSkillID]: ISkillData; } = {
	MACE_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	STAFF_ATTACK: {
		title: 'Attack',
		cost: 2,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	}
};

export default magicalSkills;
