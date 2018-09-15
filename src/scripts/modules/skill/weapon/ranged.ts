import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';
import { WeaponSkillID, IRangedWeaponSkillList } from 'modules/skill/weapon/types';

const rangedSkills: IRangedWeaponSkillList = {
	[WeaponSkillID.BOW_ATTACK]: {
		title: 'Attack',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	},
	[WeaponSkillID.BOW_CHARGE]: {
		title: 'Charge',
		cost: 4,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		physicalDamage: 1.5,
		elementalDamage: 0,
		status: []
	},
	[WeaponSkillID.GUN_1H_ATTACK]: {
		title: 'Attack',
		cost: 1,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		isFixedPhysicalDamage: true,
		physicalDamage: 100,
		elementalDamage: 0,
		status: []
	},
	[WeaponSkillID.GUN_1H_CRIPPLE]: {
		title: 'Cripple',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		isFixedPhysicalDamage: true,
		physicalDamage: 50,
		elementalDamage: 0,
		status: ['CRIPPLE']
	},
	[WeaponSkillID.GUN_2H_ATTACK]: {
		title: 'Attack',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R4,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		isFixedPhysicalDamage: true,
		physicalDamage: 200,
		elementalDamage: 0,
		status: []
	},
	[WeaponSkillID.GUN_2H_PIERCE]: {
		title: 'Pierce',
		cost: 4,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.LINE,
		target: SkillTarget.ENEMY,
		element: SkillElement.NONE,
		isFixedPhysicalDamage: true,
		physicalDamage: 100,
		elementalDamage: 0,
		status: []
	}
};

export default rangedSkills;
