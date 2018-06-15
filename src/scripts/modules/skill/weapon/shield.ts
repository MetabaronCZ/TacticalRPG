import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';
import { WeaponSkillID, IShieldWeaponSkillList } from 'modules/skill/weapon/types';

const shieldSkills: IShieldWeaponSkillList = {
	[WeaponSkillID.SHIELD_SMALL_BLOCK]: {
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
	},
	[WeaponSkillID.SHIELD_LARGE_BLOCK]: {
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
	}
};

export default shieldSkills;
