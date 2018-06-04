import { ISkill } from 'modules/skill';
import { ISkillset } from 'modules/skillset';
import { JobSkillID } from 'modules/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

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
	}]
];

export const vampirismSkillset: ISkillset = {
	title: 'Vampirism',
	description: '',
	skills: vampirism.map(([id, skill]) => id)
};

export default vampirism;
