import { ISkillset } from 'modules/skillset';
import { JobSkillID, IAimJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const aim: IAimJobSkillList = {
	[JobSkillID.AIM_NONE]: {
		title: 'Aim',
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

export const aimSkillset: ISkillset = {
	title: 'Aim',
	description: '',
	skills: Object.keys(aim) as JobSkillID[]
};

export default aim;
