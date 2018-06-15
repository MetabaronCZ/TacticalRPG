import { ISkillset } from 'modules/skillset';
import { JobSkillID, ILycanthropyJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const lycanthropy: ILycanthropyJobSkillList = {
	[JobSkillID.LYCANTHROPY_NONE]: {
		title: 'Lycanthropy',
		cost: 0,
		type: SkillType.ACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.NONE,
		isAreaEffect: false,
		element: SkillElement.NONE,
		physicalDamage: 0.75,
		elementalDamage: 0.75,
		status: []
	}
};

export const lycanthropySkillset: ISkillset = {
	title: 'Lycanthropy',
	description: '',
	skills: Object.keys(lycanthropy) as JobSkillID[]
};

export default lycanthropy;
