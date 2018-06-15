import { ISkillset } from 'modules/skillset';
import { JobSkillID, ICorruptionJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const corruption: ICorruptionJobSkillList = {
	[JobSkillID.CORRUPTION_NONE]: {
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
	}
};

export const corruptionSkillset: ISkillset = {
	title: 'Corruption',
	description: '',
	skills: Object.keys(corruption) as JobSkillID[]
};

export default corruption;
