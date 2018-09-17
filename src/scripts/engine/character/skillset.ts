import Skillsets from 'data/skillsets';

import Skill from 'engine/skill';
import { SkillsetID } from 'engine/character/skillset-data';
import { SkillElement } from 'engine/skill/skill-data';

class Skillset {
	private readonly id: SkillsetID;
	private readonly title: string;
	private readonly description: string;
	private readonly element: SkillElement;
	private readonly skills: Skill[];

	constructor(id: SkillsetID) {
		const data = Skillsets.get(id);
		this.id = id;
		this.title = data.title;
		this.description = data.description;
		this.element = data.element;
		this.skills = data.skills.map(skillId => new Skill(skillId));
	}

	public getId(): SkillsetID {
		return this.id;
	}

	public getTitle(): string {
		return this.title;
	}

	public getDescription(): string {
		return this.description;
	}

	public getElement(): SkillElement {
		return this.element;
	}

	public getSkills(): Skill[] {
		return this.skills;
	}
}

export default Skillset;
