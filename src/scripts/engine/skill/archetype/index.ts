import DataList from 'core/data-list';
import { ISkillData } from 'engine/skill';

export type ArchetypeSkillID = 'EVADE';

class ArchetypeSkillList extends DataList<ArchetypeSkillID, ISkillData> {}

const ArchetypeSkills = new ArchetypeSkillList({
	EVADE: {
		title: 'Evade',
		cost: 2,
		type: 'REACTIVE',
		range: 1,
		area: 'SINGLE'
	}
});

export default ArchetypeSkills;
