import { ISkill } from 'models/skill';
import { WeaponSkillID } from 'models/skill/weapon/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'models/skill/attributes';

const magicalSkills: Array<[WeaponSkillID, ISkill]> = [
	[WeaponSkillID.MACE_ATTACK, {
		title: 'Attack',
		cost: 1,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSkillID.STAFF_ATTACK, {
		title: 'Attack',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	}]
];

export default magicalSkills;
