import { ISkillset } from 'modules/skillset';
import { JobSkillID, ICombatJobSkillList } from 'modules/skill/job/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

const combat: ICombatJobSkillList = {
	[JobSkillID.COMBAT_NONE]: {
		title: 'Combat',
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

export const combatSkillset: ISkillset = {
	title: 'Combat',
	description: '',
	skills: Object.keys(combat) as JobSkillID[]
};

export default combat;
