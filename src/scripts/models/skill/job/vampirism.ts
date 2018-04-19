import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { ISkill, SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'models/skill';

const vampirism: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.VAMPIRISM_NONE, {
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
	}],
];

export const vampirismSkillset: ISkillset = {
	title: 'Vampirism',
	description: '',
	skills: vampirism.map(([id, skill]) => id)
};

export default vampirism;
