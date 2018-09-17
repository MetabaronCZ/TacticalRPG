import Skill from 'engine/skill';

export type CharacterActionID =
	'ATTACK' | 'DOUBLE_ATTACK' | 'WEAPON' | 'MAGIC' |
	'PASS' | 'REACTION' | 'DONT_REACT' | 'DIRECT' | 'CONFIRM' | 'BACK';

class CharacterAction {
	private readonly id: CharacterActionID;
	private readonly cost: number;
	private readonly title: string;
	private readonly active: boolean;
	private readonly skills: Skill[];

	constructor(id: CharacterActionID, title: string, cost: number, isActive = true, skills: Skill[] = []) {
		this.id = id;
		this.cost = cost;
		this.title = title;
		this.active = isActive;
		this.skills = skills;
	}

	public isActive() {
		return this.active;
	}

	public getId() {
		return this.id;
	}

	public getCost() {
		return this.cost;
	}

	public getTitle() {
		return this.title;
	}

	public getSkills() {
		return this.skills;
	}
}

export default CharacterAction;
