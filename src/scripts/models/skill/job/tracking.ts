import { ISkillset } from 'models/skillset';
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

export const trackingSkillset: ISkillset = {
	title: 'Tracking',
	description: '',
	skills: tracking.map(([id, skill]) => id)
};

export default tracking;
