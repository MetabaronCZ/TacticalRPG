import { WeaponSKillID } from 'models/skill/weapon/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const magicalSkills: Array<[WeaponSKillID, ISKill]> = [
	[WeaponSKillID.MACE_ATTACK, {
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
	[WeaponSKillID.STAFF_ATTACK, {
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
	}]
];

export default magicalSkills;
