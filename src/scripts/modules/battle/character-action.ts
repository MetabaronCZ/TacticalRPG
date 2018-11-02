import Skill from 'modules/skill';

export type CharacterActionID =
	'ATTACK' | 'DOUBLE_ATTACK' | 'WEAPON' | 'MAGIC' |
	'PASS' | 'REACTION' | 'DONT_REACT' | 'DIRECT' | 'CONFIRM' | 'BACK';

class CharacterAction {
	public readonly id: CharacterActionID;
	public readonly cost: number;
	public readonly title: string;
	public readonly cooldown: number;
	public readonly skills: Skill[];
	private active: boolean;

	constructor(id: CharacterActionID, title: string, cost = 0, cooldown = 0, isActive = true, skills: Skill[] = []) {
		this.id = id;
		this.cost = cost;
		this.title = title;
		this.active = isActive;
		this.cooldown = cooldown;
		this.skills = skills;
	}

	public isActive() {
		return this.active;
	}
}

export default CharacterAction;
