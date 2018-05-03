import { ISkill } from 'models/skill';
import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'models/skill/attributes';

const divinity: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.DIVINITY_NONE, {
		title: 'Divinity',
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

export const divinitySkillset: ISkillset = {
	title: 'Divinity',
	description: '',
	skills: divinity.map(([id, skill]) => id)
};

export default divinity;
