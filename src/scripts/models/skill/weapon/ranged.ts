import { WeaponSKillID } from 'models/skill/weapon/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement, SkillStatus } from 'models/skill';

const rangedSkills: Array<[WeaponSKillID, ISKill]> = [
	[WeaponSKillID.BOW_ATTACK, {
		title: 'Attack',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSKillID.BOW_CHARGE, {
		title: 'Charge',
		cost: 4,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 1.5,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSKillID.GUN_1H_ATTACK, {
		title: 'Attack',
		cost: 1,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSKillID.GUN_1H_CRIPPLE, {
		title: 'Cripple',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 0.5,
		elementalDamage: 0,
		status: [SkillStatus.CRIPPLE]
	}],
	[WeaponSKillID.GUN_2H_ATTACK, {
		title: 'Attack',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 1,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSKillID.GUN_2H_SPREAD, {
		title: 'Spread',
		cost: 4,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.CONE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 0.5,
		elementalDamage: 0,
		status: []
	}],
];

export default rangedSkills;
