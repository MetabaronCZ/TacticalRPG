import { WeaponSKillID } from 'models/skill/weapon/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const shieldSkills: Array<[WeaponSKillID, ISKill]> = [
	[WeaponSKillID.SHIELD_SMALL_BLOCK, {
		title: 'Block',
		type: SKillType.REACTIVE,
		range: SKillRange.R0,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}],
	[WeaponSKillID.SHIELD_LARGE_BLOCK, {
		title: 'Block',
		type: SKillType.REACTIVE,
		range: SKillRange.R0,
		area: SKillArea.SINGLE,
		usage: SkillUsage.SPECIAL
	}]
];

export default shieldSkills;
