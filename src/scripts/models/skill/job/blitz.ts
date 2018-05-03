import { ISkill } from 'models/skill';
import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'models/skill/attributes';

const blitz: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.BLITZ_NONE, {
		title: 'Blitz',
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

export const blitzSkillset: ISkillset = {
	title: 'Blitz',
	description: '',
	skills: blitz.map(([id, skill]) => id)
};

export default blitz;
