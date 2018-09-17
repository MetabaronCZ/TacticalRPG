import Skillsets from 'data/skillsets';

import Skill from 'engine/skill';
import { SkillElement } from 'engine/skill/skill-data';
import { SkillsetID } from 'engine/character/skillset-data';

class Skillset {
	public readonly id: SkillsetID;
	public readonly title: string;
	public readonly description: string;
	public readonly element: SkillElement;
	public readonly skills: Skill[];

	constructor(id: SkillsetID) {
		const data = Skillsets.get(id);
		this.id = id;
		this.title = data.title;
		this.description = data.description;
		this.element = data.element;
		this.skills = data.skills.map(skillId => new Skill(skillId));
	}
}

export default Skillset;
