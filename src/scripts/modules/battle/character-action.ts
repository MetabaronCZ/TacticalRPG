import Skill from 'modules/skill';
import { Ultimate } from 'modules/skill/skill-data';

export type CharacterActionID =
	'ATTACK' | 'DOUBLE_ATTACK' | 'WEAPON' | 'MAGIC' | 'DYNAMIC' |
	'PASS' | 'REACTION' | 'DONT_REACT' | 'DIRECT' | 'CONFIRM' | 'BACK';

class CharacterAction {
	public readonly id: CharacterActionID;
	public readonly cost: number;
	public readonly title: string;
	public readonly cooldown: number | Ultimate;
	public readonly skills: Skill[];
	private active: boolean;

	constructor(id: CharacterActionID, title: string, cost = 0, cooldown: number | Ultimate = 0, isActive = true, skills: Skill[] = []) {
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
