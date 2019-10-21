import { getIntersection } from 'core/array';

import Skill from 'modules/skill';
import Tile from 'modules/geometry/tile';
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

export interface ICommandSnapshot {
	readonly id: string;
	readonly type: CommandType;
	readonly title: string;
	readonly skills: Skill[];
	readonly cooldown: SkillCooldown ;
	readonly cost: ICommandCost | null;
	readonly isActive: boolean;
	readonly isSupport: boolean;
	readonly isUsable: true | CommandReason;
}

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
	const apCost = skills.map(s => s.cost.AP).reduce((a, b) => a + b);
	const mpCost = skills.map(s => s.cost.MP).reduce((a, b) => a + b);
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
		this.isSupport = !!skills.find(skill => !!skill.healing);

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
		const { active, cooldown, character, cost, skills } = this;

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

				const usesWeapon = !!skills.find(skill => skill.physical);
				const usesMagic = !!skills.find(skill => skill.magical || skill.healing);

				if (AP < cost.AP) {
					return 'OUT_OF_AP';
				}

				if (MP < cost.MP) {
					return 'OUT_OF_MP';
				}

				if (usesWeapon && isDisarmed) {
					return 'DISARMED';
				}

				if (usesMagic && isSilenced) {
					return 'SILENCED';
				}
			}
		}

		return true;
	}

	public getSkillArea(caster: Character, characters: Character[]): Tile[] {
		const hitScanObstacles = characters.map(char => char.position);

		const allyTiles = characters
			.filter(char => char.player === caster.player)
			.map(char => char.position);

		const skillAreas = this.skills.map(skill => {
			const tiles = skill.getTargetable(caster.position, hitScanObstacles);

			if ('ENEMY' === skill.target) {
				// exclude ally character positions
				return tiles.filter(tile => !allyTiles.includes(tile));
			}
			return tiles;
		});

		return getIntersection(skillAreas);
	}

	public getSkillTargetable(caster: Character, characters: Character[], area: Tile[]): Character[] {
		if (!this.skills.length) {
			return [];
		}
		return this.skills[0].getTargets(caster, characters, area);
	}

	public getSkillEfectArea(caster: Character, target: Tile): Tile[] {
		if (!this.skills.length) {
			return [];
		}
		const effectAreas = this.skills.map(s => s.getEffectArea(caster.position, target));
		return getIntersection(effectAreas);
	}

	public getSkillEfectTargets(caster: Character, characters: Character[], area: Tile[]): Character[] {
		if (!this.skills.length) {
			return [];
		}
		return this.skills[0].getTargets(caster, characters, area);
	}

	public serialize(): ICommandSnapshot {
		return {
			id: this.id,
			type: this.type,
			title: this.title,
			skills: [...this.skills],
			cooldown: this.cooldown,
			cost: (this.cost ? { ...this.cost } : null),
			isActive: this.isActive(),
			isSupport: this.isSupport,
			isUsable: this.isUsable()
		};
	}

	public setActive(value: true | CommandReason): void {
		this.active = value;
	}
}

export default Command;
