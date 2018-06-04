import { ISkill } from 'modules/skill';
import { WeaponSkillID } from 'modules/skill/weapon/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget, SkillStatus } from 'modules/skill/attributes';

const wield1HSkills: Array<[WeaponSkillID, ISkill]> = [
	[WeaponSkillID.SWORD_1H_ATTACK, {
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
	[WeaponSkillID.SWORD_1H_BLEED, {
		title: 'Bleed',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.NONE,
		physicalDamage: 0.5,
		elementalDamage: 0,
		status: [SkillStatus.BLEED]
	}],
	[WeaponSkillID.AXE_1H_ATTACK, {
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
	[WeaponSkillID.AXE_1H_SMASH, {
		title: 'Smash',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.NONE,
		physicalDamage: 1.5,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSkillID.HAMMER_1H_ATTACK, {
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
	[WeaponSkillID.HAMMER_1H_STUN, {
		title: 'Stun',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.ENEMY,
		isAreaEffect: false,
		element: SkillElement.NONE,
		physicalDamage: 0.5,
		elementalDamage: 0,
		status: [SkillStatus.STUN]
	}]
];

export default wield1HSkills;
