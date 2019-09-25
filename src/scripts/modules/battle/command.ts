import Skill from 'modules/skill';
import Status from 'modules/character/status';
import Character, { ISkillCooldowns } from 'modules/character';
import { SkillCooldown, SkillID } from 'modules/skill/skill-data';

export type CommandReason =
	'COOLDOWN' | 'CANT_ACT' | 'OUT_OF_AP' | 'OUT_OF_MP' | 'DISARMED' | 'SILENCED';

export interface ICommandCost {
	readonly AP: number;
	readonly MP: number;
}

export type CommandType =
	'ATTACK' | 'DOUBLE_ATTACK' | 'WEAPON' | 'MAGIC' | 'DYNAMIC' |
	'PASS' | 'REACTION' | 'DONT_REACT' | 'DIRECT' | 'CONFIRM' | 'BACK';

export interface ICommandRecord {
	title: string;
	skills: SkillID[];
}

export const formatCost = (cost: ICommandCost | null): string => {
	if (!cost) {
		return '';
	}
	const costArray = [cost.AP ? `${cost.AP} AP` : '', cost.MP ? `${cost.MP} MP` : ''];
	return costArray.filter(c => '' !== c).join(' | ');
};

const getCost = (skills: Skill[], status: Status): ICommandCost => {
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

class Command {
	public readonly id: string;
	public readonly type: CommandType;
	public readonly title: string;
	public readonly skills: Skill[] = [];
	public readonly cooldown: SkillCooldown = 0;
	public readonly isSupport: boolean;
	public cost: ICommandCost | null = null;

	private readonly character: Character | null;
	private active: true | CommandReason = true;

	constructor(type: CommandType, title: string, character?: Character, skills: Skill[] = []) {
		this.id = `${type}-${skills.map(s => s.id).join(',') || 'X'}`;
		this.type = type;
		this.title = title;
		this.skills = skills;
		this.character = character || null;
		this.isSupport = !!skills.find(skill => skill.isSupport);

		if (character) {
			this.cost = getCost(skills, character.status);
			this.cooldown = getCooldown(skills, character.cooldowns);
		}
		this.active = this.isUsable(true);

		// remove DOUBLE_ATTTACK from skills (not needed after computations)
		this.skills = this.skills.filter(skill => 'DOUBLE_ATTACK' !== skill.id);
	}

	public isActive(): boolean {
		return true === this.isUsable();
	}

	public isUsable(initial = false): true | CommandReason {
		const { active, cooldown, character, cost } = this;

		if (!initial && true !== active) {
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

	public setActive(value: true | CommandReason): void {
		this.active = value;
	}
}

export default Command;
