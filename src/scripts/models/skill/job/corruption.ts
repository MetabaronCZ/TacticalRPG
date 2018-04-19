import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { ISkill, SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'models/skill';

const corruption: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.CORRUPTION_NONE, {
		title: 'Corruption',
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

export const corruptionSkillset: ISkillset = {
	title: 'Corruption',
	description: '',
	skills: corruption.map(([id, skill]) => id)
};

export default corruption;
