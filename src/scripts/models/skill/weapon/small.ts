import { WeaponSKillID } from 'models/skill/weapon/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement, SkillStatus } from 'models/skill';

const smallSkills: Array<[WeaponSKillID, ISKill]> = [
	[WeaponSKillID.FISTS_ATTACK, {
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
	[WeaponSKillID.FISTS_DISARM, {
		title: 'Disarm',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 0.5,
		elementalDamage: 0,
		status: [SkillStatus.DISARM]
	}],
	[WeaponSKillID.DAGGER_ATTACK, {
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
	[WeaponSKillID.DAGGER_STAB, {
		title: 'Stab',
		cost: 2,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 2,
		elementalDamage: 0,
		status: []
	}]
];

export default smallSkills;
