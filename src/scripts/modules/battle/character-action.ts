import Skill from 'modules/skill';
import Status from 'modules/character/status';
import { SkillCooldown } from 'modules/skill/skill-data';
import Character, { ISkillCooldowns } from 'modules/character';

export interface ICharacterActionCost {
	AP: number;
	MP: number;
}

export type CharacterActionType =
	'ATTACK' | 'DOUBLE_ATTACK' | 'WEAPON' | 'MAGIC' | 'DYNAMIC' |
	'PASS' | 'REACTION' | 'DONT_REACT' | 'DIRECT' | 'CONFIRM' | 'BACK';

const getCost = (skills: Skill[], status: Status): ICharacterActionCost => {
	const apCost = skills.map(s => s.apCost).reduce((a, b) => a + b);
	const mpCost = skills.map(s => s.mpCost).reduce((a, b) => a + b);
	const costModifier = (status.has('CONFUSION') ? 2 : 1);

	return {
		AP: apCost * costModifier,
		MP: mpCost * costModifier
	};
};

const getCooldown = (skills: Skill[], cooldowns: ISkillCooldowns): SkillCooldown => {
	const cds = skills.map(skill => cooldowns[skill.id] || 0);
	let cd: SkillCooldown = 0;

	for (const c of cds) {
		if ('ULTIMATE' === c) {
			return c;
		}
		if (c > cd) {
			cd = c;
		}
	}
	return cd;
};

const isActive = (character: Character, cost: ICharacterActionCost, cooldown: SkillCooldown): boolean => {
	if (0 !== cooldown) {
		// skills on cooldown
		return false;
	}
	const { AP, MP } = character.attributes;

	if (AP < cost.AP || MP < cost.MP) {
		// cannot afford to use skills
		return false;
	}
	const isDisarmed = character.status.has('DISARM');
	const isSilenced = character.status.has('SILENCE');

	if (!character.canAct() || (cost.AP && isDisarmed) || (cost.MP && isSilenced)) {
		// invalid character status
		return false;
	}
	return true;
};

class CharacterAction {
	public readonly type: CharacterActionType;
	public readonly title: string;
	public readonly skills: Skill[] = [];
	public readonly cooldown: SkillCooldown = 0;
	public cost: ICharacterActionCost | null = null;
	public active: boolean = true;

	constructor(type: CharacterActionType, title: string, character?: Character, skills: Skill[] = []) {
		this.type = type;
		this.title = title;
		this.skills = skills;

		if (character) {
			this.cost = getCost(skills, character.status);
			this.cooldown = getCooldown(skills, character.cooldowns);
			this.active = isActive(character, this.cost, this.cooldown);
		}
	}
}

export default CharacterAction;
