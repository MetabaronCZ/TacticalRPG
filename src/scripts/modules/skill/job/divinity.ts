import { ISkillset } from 'modules/skillset';
import { JobSkillID, IDivinityJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const divinity: IDivinityJobSkillList = {
	[JobSkillID.DIVINITY_NONE]: {
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
	}
};

export const divinitySkillset: ISkillset = {
	title: 'Divinity',
	description: '',
	skills: Object.keys(divinity) as JobSkillID[]
};

export default divinity;
