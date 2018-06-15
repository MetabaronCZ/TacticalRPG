import { ISkillset } from 'modules/skillset';
import { JobSkillID, ITrackingJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const tracking: ITrackingJobSkillList = {
	[JobSkillID.TRACKING_NONE]: {
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
	}
};

export const trackingSkillset: ISkillset = {
	title: 'Tracking',
	description: '',
	skills: Object.keys(tracking) as JobSkillID[]
};

export default tracking;
