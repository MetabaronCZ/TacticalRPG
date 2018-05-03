import { ISkill } from 'models/skill';
import { ISkillset } from 'models/skillset';
import { JobSkillID } from 'models/skill/job/id';
import { SkillType, SkillArea, SkillRange, SkillTarget, SkillElement, SkillStatus } from 'models/skill/attributes';

const berserking: Array<[JobSkillID, ISkill]> = [
	[JobSkillID.BERSERKING_BERSERK, {
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
	}]
];

export const berserkingSkillset: ISkillset = {
	title: 'Berserking',
	description: '',
	skills: berserking.map(([id, skill]) => id)
};

export default berserking;
