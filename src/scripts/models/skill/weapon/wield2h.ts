import { WeaponSKillID } from 'models/skill/weapon/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const sword2HSkills: Array<[WeaponSKillID, ISKill]> = [
	[WeaponSKillID.SPEAR_ATTACK, {
		title: 'Attack',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R2,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSKillID.SPEAR_THRUST, {
		title: 'Thrust',
		cost: 4,
		type: SKillType.ACTIVE,
		range: SKillRange.R2,
		area: SKillArea.LINE,
		isAreaEffect: true,
		element: SKillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSKillID.SWORD_2H_ATTACK, {
		title: 'Attack',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSKillID.SWORD_2H_CLEAVE, {
		title: 'Cleave',
		cost: 4,
		type: SKillType.ACTIVE,
		range: SKillRange.R0,
		area: SKillArea.AOE3x3,
		isAreaEffect: true,
		element: SKillElement.NONE,
		physicalDamage: 0.5,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSKillID.AXE_2H_ATTACK, {
		title: 'Attack',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSKillID.AXE_2H_WHIRLWIND, {
		title: 'Whirlwind',
		cost: 4,
		type: SKillType.ACTIVE,
		range: SKillRange.R0,
		area: SKillArea.AOE3x3,
		isAreaEffect: true,
		element: SKillElement.NONE,
		physicalDamage: 0.5,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSKillID.HAMMER_2H_ATTACK, {
		title: 'Attack',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSKillID.HAMMER_2H_SHOCKWAVE, {
		title: 'Shockwave',
		cost: 4,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.CROSS,
		isAreaEffect: true,
		element: SKillElement.NONE,
		physicalDamage: 0.5,
		elementalDamage: 0,
		status: []
	}]
];

export default sword2HSkills;
