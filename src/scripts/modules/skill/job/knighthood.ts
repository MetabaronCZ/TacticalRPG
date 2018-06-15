import { ISkillset } from 'modules/skillset';
import { JobSkillID, IKnighthoodJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget, SkillStatus } from 'modules/skill/attributes';

const knighthood: IKnighthoodJobSkillList = {
	[JobSkillID.KNIGHTHOOD_ULTIMATE_DEFENSE]: {
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
	}
};

export const knighthoodSkillset: ISkillset = {
	title: 'Knighthood',
	description: '',
	skills: Object.keys(knighthood) as JobSkillID[]
};

export default knighthood;
