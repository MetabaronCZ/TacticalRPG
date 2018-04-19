import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { ISkill, SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'models/skill';

const tracking: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.TRACKING_NONE, {
		title: 'Tracking',
		cost: 0,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.NONE,
		isAreaEffect: false,
		element: SkillElement.NONE,
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
