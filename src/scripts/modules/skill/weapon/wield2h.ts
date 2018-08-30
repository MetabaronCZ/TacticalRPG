import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';
import { WeaponSkillID, IWield2HWeaponSkillList } from 'modules/skill/weapon/types';

const sword2HSkills: IWield2HWeaponSkillList = {
	[WeaponSkillID.SPEAR_ATTACK]: {
		title: 'Attack',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R2,
		area: SkillArea.LINE,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	},
	[WeaponSkillID.SPEAR_THRUST]: {
		title: 'Thrust',
		cost: 4,
		type: SkillType.ACTIVE,
		range: SkillRange.R2,
		area: SkillArea.LINE,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	},
	[WeaponSkillID.SWORD_2H_ATTACK]: {
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
	},
	[WeaponSkillID.SWORD_2H_CLEAVE]: {
		title: 'Cleave',
		cost: 4,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.NEIGHBOURS,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		physicalDamage: 0.5,
		elementalDamage: 0,
		status: []
	},
	[WeaponSkillID.AXE_2H_ATTACK]: {
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
	},
	[WeaponSkillID.AXE_2H_WHIRLWIND]: {
		title: 'Whirlwind',
		cost: 4,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.NEIGHBOURS,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		physicalDamage: 0.5,
		elementalDamage: 0,
		status: []
	},
	[WeaponSkillID.HAMMER_2H_ATTACK]: {
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
	},
	[WeaponSkillID.HAMMER_2H_SHOCKWAVE]: {
		title: 'Shockwave',
		cost: 4,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.CROSS,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		physicalDamage: 0.5,
		elementalDamage: 0,
		status: []
	}
};

export default sword2HSkills;
