import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SkillUsage } from 'models/skill';

const tracking: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.TRACKING_NONE, {
		title: 'Tracking',
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		usage: SkillUsage.ATTACK
	}],
];

export const trackingSkills = tracking.map(([id, skill]) => id);
export default tracking;
