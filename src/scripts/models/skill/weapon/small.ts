import { WeaponSKillID } from 'models/skill/weapon/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const smallSkills: Array<[WeaponSKillID, ISKill]> = [
	[WeaponSKillID.FISTS_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.FISTS_DISARM, {
		title: 'Disarm',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.DAGGER_ATTACK, {
		title: 'Attack',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
	[WeaponSKillID.DAGGER_STAB, {
		title: 'Stab',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}]
];

export default smallSkills;
