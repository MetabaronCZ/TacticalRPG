import { ISkillData } from 'engine/skill/skill-data';
import { ArchetypeSkillID } from 'engine/skill/archetype';

const archetypeSkills: { [id in ArchetypeSkillID]: ISkillData; } = {
	EVADE: {
		title: 'Evade',
		cost: 2,
		type: 'REACTIVE',
		range: 1,
		area: 'SINGLE'
	}
};

export default archetypeSkills;
