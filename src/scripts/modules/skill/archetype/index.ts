import DataList from 'core/data-list';

import { ISkill } from 'modules/skill/types';
import { ArchetypeSkillID } from 'modules/skill/archetype/types';
import { SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'modules/skill/attributes';

class ArchetypeSkillList extends DataList<ArchetypeSkillID, ISkill> {}

const ArchetypeSkills = new ArchetypeSkillList({
	[ArchetypeSkillID.EVADE]: {
		title: 'Evade',
		cost: 2,
		type: SkillType.REACTIVE,
		range: SkillRange.R1,
		area: SkillArea.SINGLE,
		target: SkillTarget.NONE,
		element: SkillElement.NONE,
		physicalDamage: 0,
		elementalDamage: 0,
		status: []
	}
});

export default ArchetypeSkills;
