import { ISkill } from 'modules/skill';
import { ISkillset } from 'modules/skillset';
import { JobSkillID } from 'modules/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

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
	}]
];

export const corruptionSkillset: ISkillset = {
	title: 'Corruption',
	description: '',
	skills: corruption.map(([id, skill]) => id)
};

export default corruption;
