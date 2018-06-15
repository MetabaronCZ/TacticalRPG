import { ISkillset } from 'modules/skillset';
import { JobSkillID, IAlchemyJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const alchemy: IAlchemyJobSkillList = {
	[JobSkillID.ALCHEMY_NONE]: {
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
	}
};

export const alchemySkillset: ISkillset = {
	title: 'Alchemy',
	description: '',
	skills: Object.keys(alchemy) as JobSkillID[]
};

export default alchemy;
