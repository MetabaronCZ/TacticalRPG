import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const weaponMastery: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.WEAPON_MASTERY_NONE, {
		title: 'Weapon Mastery',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const weaponMasterySkills = weaponMastery.map(([id, skill]) => id);
export default weaponMastery;
