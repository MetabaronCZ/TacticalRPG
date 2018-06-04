import { ISkill } from 'modules/skill';
import { ISkillset } from 'modules/skillset';
import { JobSkillID } from 'modules/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const alchemy: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.ALCHEMY_NONE, {
		title: 'Alchemy',
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

export const alchemySkillset: ISkillset = {
	title: 'Alchemy',
	description: '',
	skills: alchemy.map(([id, skill]) => id)
};

export default alchemy;
