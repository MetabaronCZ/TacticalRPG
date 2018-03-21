import { WeaponSKillID } from 'models/skill/weapon/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const wield1HSkills: Array<[WeaponSKillID, ISKill]> = [
	[WeaponSKillID.SWORD_1H_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.SWORD_1H_BLEED, {
		title: 'Bleed',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.AXE_1H_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.AXE_1H_SMASH, {
		title: 'Smash',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.HAMMER_1H_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.HAMMER_1H_STUN, {
		title: 'Stun',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}]
];

export default wield1HSkills;
