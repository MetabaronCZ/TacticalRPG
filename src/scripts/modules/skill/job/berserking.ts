import { ISkillset } from 'modules/skillset';
import { JobSkillID, IBerserkingJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillArea, SkillRange, SkillTarget, SkillElement, SkillStatus } from 'modules/skill/attributes';

const berserking: IBerserkingJobSkillList = {
	[JobSkillID.BERSERKING_BERSERK]: {
		title: 'Berserk',
		cost: 2,
		type: SkillType.ACTIVE,
		range: SkillRange.R0,
		area: SkillArea.SINGLE,
		target: SkillTarget.SELF,
		isAreaEffect: false,
		element: SkillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: [SkillStatus.BERSERK]
	}
};

export const berserkingSkillset: ISkillset = {
	title: 'Berserking',
	description: '',
	skills: Object.keys(berserking) as JobSkillID[]
};

export default berserking;
