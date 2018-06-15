import { ISkillset } from 'modules/skillset';
import { JobSkillID, IAssassinationJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const assassination: IAssassinationJobSkillList = {
	[JobSkillID.ASSASSINATION_NONE]: {
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
	}
};

export const assassinationSkillset: ISkillset = {
	title: 'Assassination',
	description: '',
	skills: Object.keys(assassination) as JobSkillID[]
};

export default assassination;
