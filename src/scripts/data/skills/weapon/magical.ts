import { ISkillData } from 'modules/skill/skill-data';
import { MagicalWeaponSkillID } from 'modules/skill/weapon';

const magicalSkills: { [id in MagicalWeaponSkillID]: ISkillData; } = {
	MCE_ATTACK: {
		title: 'Attack',
		cost: 1,
		type: 'ACTIVE',
		range: 1,
		area: 'SINGLE',
		target: 'ENEMY',
		physicalDamage: 1
	},
	STF_ATTACK: {
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
