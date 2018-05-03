import { ISkill } from 'models/skill';
import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'models/skill/attributes';

const assassination: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.ASSASSINATION_NONE, {
		title: 'Assassination',
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

export const assassinationSkillset: ISkillset = {
	title: 'Assassination',
	description: '',
	skills: assassination.map(([id, skill]) => id)
};

export default assassination;
