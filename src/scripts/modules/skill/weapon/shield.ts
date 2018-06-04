import { ISkill } from 'modules/skill';
import { WeaponSkillID } from 'modules/skill/weapon/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const shieldSkills: Array<[WeaponSkillID, ISkill]> = [
	[WeaponSkillID.SHIELD_SMALL_BLOCK, {
		title: 'Block',
		cost: 1,
		type: SkillType.REACTIVE,
		range: SkillRange.R0,
		area: SkillArea.SINGLE,
		target: SkillTarget.SELF,
		isAreaEffect: false,
		element: SkillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSkillID.SHIELD_LARGE_BLOCK, {
		title: 'Block',
		cost: 2,
		type: SkillType.REACTIVE,
		range: SkillRange.R0,
		area: SkillArea.SINGLE,
		target: SkillTarget.SELF,
		isAreaEffect: false,
		element: SkillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}]
];

export default shieldSkills;
