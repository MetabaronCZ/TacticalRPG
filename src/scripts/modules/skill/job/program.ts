import { ISkillset } from 'modules/skillset';
import { JobSkillID, IProgramJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const program: IProgramJobSkillList = {
	[JobSkillID.PROGRAM_NONE]: {
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
	}
};

export const programSkillset: ISkillset = {
	title: 'Program',
	description: '',
	skills: Object.keys(program) as JobSkillID[]
};

export default program;
