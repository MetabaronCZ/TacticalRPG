import { ISkillset } from 'modules/skillset';
import { JobSkillID, IBlitzJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const blitz: IBlitzJobSkillList = {
	[JobSkillID.BLITZ_NONE]: {
		title: 'Blitz',
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

export const blitzSkillset: ISkillset = {
	title: 'Blitz',
	description: '',
	skills: Object.keys(blitz) as JobSkillID[]
};

export default blitz;
