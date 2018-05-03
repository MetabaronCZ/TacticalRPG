import { ISkill } from 'models/skill';
import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget, SkillStatus } from 'models/skill/attributes';

const knighthood: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.KNIGHTHOOD_ULTIMATE_DEFENSE, {
		title: 'Ultimate Defense',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R0,
		area: SkillArea.SINGLE,
		target: SkillTarget.NONE,
		isAreaEffect: false,
		element: SkillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: [SkillStatus.ULTIMATE_DEFENSE]
	}]
];

export const knighthoodSkillset: ISkillset = {
	title: 'Knighthood',
	description: '',
	skills: knighthood.map(([id, skill]) => id)
};

export default knighthood;
