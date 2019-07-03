import Skill from 'modules/skill';
import Status from 'modules/character/status';
import { SkillCooldown } from 'modules/skill/skill-data';
import Character, { ISkillCooldowns } from 'modules/character';

export type CharacterActionReason =
	'COOLDOWN' | 'CANT_ACT' | 'OUT_OF_AP' | 'OUT_OF_MP' | 'DISARMED' | 'SILENCED';

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

class CharacterAction {
	public readonly type: CharacterActionType;
	public readonly title: string;
	public readonly skills: Skill[] = [];
	public readonly cooldown: SkillCooldown = 0;
	public cost: ICharacterActionCost | null = null;
	private readonly character?: Character;
	private active: true | CharacterActionReason = true;

	constructor(type: CharacterActionType, title: string, character?: Character, skills: Skill[] = []) {
		this.type = type;
		this.title = title;
		this.skills = skills;
		this.character = character;

		if (character) {
			this.cost = getCost(skills, character.status);
			this.cooldown = getCooldown(skills, character.cooldowns);
		}

		// remove DOUBLE_ATTTACK from skills (not needed after computations)
		this.skills = this.skills.filter(skill => 'DOUBLE_ATTACK' !== skill.id);
	}

	public isActive(): boolean {
		const usable = this.isUsable();
		return true === usable;
	}

	public isUsable(): true | CharacterActionReason {
		const { active, cooldown, character, cost } = this;

		if (true !== active) {
			return active;
		}

		if (0 !== cooldown) {
			return 'COOLDOWN';
		}

		if (character) {
			if (!character.canAct()) {
				return 'CANT_ACT';
			}

			if (cost) {
				const { AP, MP } = character.attributes;
				const isDisarmed = character.status.has('DISARM');
				const isSilenced = character.status.has('SILENCE');

				if (AP < cost.AP) {
					return 'OUT_OF_AP';
				}

				if (MP < cost.MP) {
					return 'OUT_OF_MP';
				}

				if (cost.AP && isDisarmed) {
					return 'DISARMED';
				}

				if (cost.MP && isSilenced) {
					return 'SILENCED';
				}
			}
		}

		return true;
	}

	public setActive(value: true | CharacterActionReason) {
		this.active = value;
	}
}

export default CharacterAction;
