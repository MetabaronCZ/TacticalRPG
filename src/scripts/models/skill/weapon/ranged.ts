import { WeaponSKillID } from 'models/skill/weapon/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const rangedSkills: Array<[WeaponSKillID, ISKill]> = [
	[WeaponSKillID.BOW_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.BOW_CHARGE, {
		title: 'Charge',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.GUN_1H_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.GUN_1H_CRIPPLE, {
		title: 'Cripple',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.GUN_2H_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R4,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.GUN_2H_SPREAD, {
		title: 'Spread',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
];

export default rangedSkills;
