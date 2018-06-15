import { ISkillset } from 'modules/skillset';
import { JobSkillID, IVampirismJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const vampirism: IVampirismJobSkillList = {
	[JobSkillID.VAMPIRISM_NONE]: {
		title: 'Vampirism',
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

export const vampirismSkillset: ISkillset = {
	title: 'Vampirism',
	description: '',
	skills: Object.keys(vampirism) as JobSkillID[]
};

export default vampirism;
