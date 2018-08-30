import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';
import { WeaponSkillID, IMagicalWeaponSkillList } from 'modules/skill/weapon/types';

const magicalSkills: IMagicalWeaponSkillList = {
	[WeaponSkillID.MACE_ATTACK]: {
		title: 'Attack',
		cost: 1,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	},
	[WeaponSkillID.STAFF_ATTACK]: {
		title: 'Attack',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	}
};

export default magicalSkills;
