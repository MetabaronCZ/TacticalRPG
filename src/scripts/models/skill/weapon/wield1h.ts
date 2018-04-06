import { WeaponSKillID } from 'models/skill/weapon/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement, SkillStatus } from 'models/skill';

const wield1HSkills: Array<[WeaponSKillID, ISKill]> = [
	[WeaponSKillID.SWORD_1H_ATTACK, {
		title: 'Attack',
		cost: 1,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSKillID.SWORD_1H_BLEED, {
		title: 'Bleed',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 0.5,
		elementalDamage: 0,
		status: [SkillStatus.BLEED]
	}],
	[WeaponSKillID.AXE_1H_ATTACK, {
		title: 'Attack',
		cost: 1,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSKillID.AXE_1H_SMASH, {
		title: 'Smash',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 1.5,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSKillID.HAMMER_1H_ATTACK, {
		title: 'Attack',
		cost: 1,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSKillID.HAMMER_1H_STUN, {
		title: 'Stun',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 0.5,
		elementalDamage: 0,
		status: [SkillStatus.STUN]
	}]
];

export default wield1HSkills;
