import { WeaponSKillID } from 'models/skill/weapon/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const sword2HSkills: Array<[WeaponSKillID, ISKill]> = [
	[WeaponSKillID.SPEAR_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R2,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.SPEAR_THRUST, {
		title: 'Thrust',
		type: SKillType.ACTIVE,
		range: SKillRange.R2,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.SWORD_2H_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.SWORD_2H_CLEAVE, {
		title: 'Cleave',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.AXE_2H_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.AXE_2H_WHIRLWIND, {
		title: 'Whirlwind',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.HAMMER_2H_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.HAMMER_2H_SHOCKWAVE, {
		title: 'Shockwave',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}]
];

export default sword2HSkills;
