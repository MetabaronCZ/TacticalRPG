import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const assassination: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.ASSASSINATION_NONE, {
		title: 'Assassination',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const assassinationSkills = assassination.map(([id, skill]) => id);
export default assassination;
