import { ISkillset } from 'models/skillset';
import { JobSKillID } from 'models/skill/job/id';
import { ISKill, SKillType, SKillRange, SKillArea, SKillElement } from 'models/skill';

const tracking: Array<[JobSKillID, ISKill]> = [
	[JobSKillID.TRACKING_NONE, {
		title: 'Tracking',
		cost: 0,
		type: SKillType.ACTIVE,
		range: SKillRange.R1,
		area: SKillArea.SINGLE,
		isAreaEffect: false,
		element: SKillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}],
];

export const trackingSkillset: ISkillset = {
	title: 'Tracking',
	description: '',
	skills: tracking.map(([id, skill]) => id)
};

export default tracking;
