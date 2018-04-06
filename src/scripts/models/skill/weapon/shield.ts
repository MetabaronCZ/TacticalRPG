import { WeaponSKillID } from 'models/skill/weapon/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const shieldSkills: Array<[WeaponSKillID, ISKill]> = [
	[WeaponSKillID.SHIELD_SMALL_BLOCK, {
		title: 'Block',
		cost: 1,
		type: SKillType.REACTIVE,
		range: SKillRange.R0,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}],
	[WeaponSKillID.SHIELD_LARGE_BLOCK, {
		title: 'Block',
		cost: 2,
		type: SKillType.REACTIVE,
		range: SKillRange.R0,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}]
];

export default shieldSkills;
