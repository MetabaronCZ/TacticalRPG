import { ISkill } from 'models/skill';
import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'models/skill/attributes';

const illusion: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.ILLUSION_NONE, {
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
	}]
];

export const illusionSkillset: ISkillset = {
	title: 'Illusion',
	description: '',
	skills: illusion.map(([id, skill]) => id)
};

export default illusion;
