import { ISkillset } from 'modules/skillset';
import { JobSkillID, IMartialArtsJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const martialArts: IMartialArtsJobSkillList = {
	[JobSkillID.MARTIAL_ARTS_NONE]: {
		title: 'Martial Arts',
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

export const martialArtsSkillset: ISkillset = {
	title: 'Martial Arts',
	description: '',
	skills: Object.keys(martialArts) as JobSkillID[]
};

export default martialArts;
