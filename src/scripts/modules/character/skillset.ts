import Skillsets from 'data/skillsets';

import Skill from 'modules/skill';
import { ArchetypeID } from 'modules/character/archetype';
import { SkillsetID } from 'modules/character/skillset-data';
import { SkillElement, SkillGrade } from 'modules/skill/skill-data';

class Skillset {
	public readonly id: SkillsetID;
	public readonly title: string;
	public readonly description: string;
	public readonly element: SkillElement;
	public readonly grade: SkillGrade;
	public readonly skills: Skill[];

	constructor(id: SkillsetID, archetype: ArchetypeID) {
		const data = Skillsets.get(id);
		this.id = id;
		this.title = data.title;
		this.description = data.description;
		this.grade = this.getSkillGrade(archetype);
		this.element = data.element;

		this.skills = data.skills
			.map(skillId => new Skill(skillId))
			.filter(skill => skill.grade <= this.grade);
	}

	private getSkillGrade(archetype: ArchetypeID): SkillGrade {
		switch (archetype) {
			case 'MM':
				return 2;
			case 'PM':
			case 'SM':
				return 1;
			default:
				return 0;
		}
	}
}

export default Skillset;
