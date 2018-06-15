import { ISkillset } from 'modules/skillset';
import { JobSkillID, IPerformanceJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const performance: IPerformanceJobSkillList = {
	[JobSkillID.PERFORMANCE_NONE]: {
		title: 'Performance',
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

export const performanceSkillset: ISkillset = {
	title: 'Performance',
	description: '',
	skills: Object.keys(performance) as JobSkillID[]
};

export default performance;
