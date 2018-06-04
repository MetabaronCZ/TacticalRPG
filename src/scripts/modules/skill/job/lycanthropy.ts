import { ISkill } from 'modules/skill';
import { ISkillset } from 'modules/skillset';
import { JobSkillID } from 'modules/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const lycanthropy: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.LYCANTHROPY_NONE, {
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
	}]
];

export const lycanthropySkillset: ISkillset = {
	title: 'Lycanthropy',
	description: '',
	skills: lycanthropy.map(([id, skill]) => id)
};

export default lycanthropy;
