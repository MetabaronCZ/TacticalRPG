import { ISkill } from 'models/skill';
import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'models/skill/attributes';

const program: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.PROGRAM_NONE, {
		title: 'Program',
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

export const programSkillset: ISkillset = {
	title: 'Program',
	description: '',
	skills: program.map(([id, skill]) => id)
};

export default program;
