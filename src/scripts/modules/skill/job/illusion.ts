import { ISkillset } from 'modules/skillset';
import { JobSkillID, IIlusionJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const illusion: IIlusionJobSkillList = {
	[JobSkillID.ILLUSION_NONE]: {
		title: 'Invisibility',
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

export const illusionSkillset: ISkillset = {
	title: 'Illusion',
	description: '',
	skills: Object.keys(illusion) as JobSkillID[]
};

export default illusion;
