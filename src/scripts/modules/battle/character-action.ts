import Skill from 'modules/skill';
import { Ultimate } from 'modules/skill/skill-data';

export interface ICharacterActionCost {
	AP: number;
	MP: number;
}

export type CharacterActionType =
	'ATTACK' | 'DOUBLE_ATTACK' | 'WEAPON' | 'MAGIC' | 'DYNAMIC' |
	'PASS' | 'REACTION' | 'DONT_REACT' | 'DIRECT' | 'CONFIRM' | 'BACK';

class CharacterAction {
	public readonly type: CharacterActionType;
	public readonly cost: ICharacterActionCost | null;
	public readonly title: string;
	public readonly cooldown: number | Ultimate;
	public readonly skills: Skill[];
	private active: boolean;

	constructor(type: CharacterActionType, title: string, cost: ICharacterActionCost | null = null, cooldown: number | Ultimate = 0, isActive = true, skills: Skill[] = []) {
		this.type = type;
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
