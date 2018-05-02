import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { ISkill, SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'models/skill';

const martialArts: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.MARTIAL_ARTS_NONE, {
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
	}]
];

export const martialArtsSkillset: ISkillset = {
	title: 'Martial Arts',
	description: '',
	skills: martialArts.map(([id, skill]) => id)
};

export default martialArts;
