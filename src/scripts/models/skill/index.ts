import { PlayerType } from 'models/player';
import { ICharacter } from 'models/character';
import { IPosition, Position } from 'models/position';

export enum SkillType {
	ACTIVE = 'ACTIVE',
	REACTIVE = 'REACTIVE',
	PASSIVE = 'PASSIVE'
}

export enum SkillRange {
	R0 = 0,
	R1 = 1,
	R2 = 2,
	R4 = 4
}

export enum SkillArea {
	SINGLE = 'SINGLE',
	LINE = 'LINE',
	CROSS = 'CROSS',
	AOE3x3 = 'AOE3x3',
	NEIGHBOURS = 'NEIGHBOURS'
}

export enum SkillElement {
	NONE = 'NONE',
	FIRE = 'FIRE',
	ICE = 'ICE',
	WIND = 'WIND',
	EARTH = 'EARTH',
	THUNDER = 'THUNDER',
	WATER = 'WATER',
	DARK = 'DARK',
	HOLY = 'HOLY',
	PSYCHIC = 'PSYCHIC'
}

export enum SkillStatus {
	CRIPPLE = 'CRIPPLE',
	DISARM = 'DISARM',
	BLEED = 'BLEED',
	STUN = 'STUN',
	BURN = 'BURN',
	SHOCK = 'SHOCK',
	FREEZE = 'FREEZE',
	FORGET = 'FORGET',
	SILENCE = 'SILENCE',

	FLOAT = 'FLOAT',
	REGEN = 'REGEN',
	BERSERK = 'BERSERK',
	IRON_SKIN = 'IRON_SKIN',
	ULTIMATE_DEFENSE = 'ULTIMATE_DEFENSE'
}

export enum SkillTarget {
	NONE = 'NONE',
	ANY = 'ANY',
	SELF = 'SELF',
	ALLY = 'ALLY',
	ENEMY = 'ENEMY',
}

export interface ISkill {
	readonly title: string;
	readonly cost: number; // AP cost
	readonly type: SkillType;
	readonly range: SkillRange;
	readonly area: SkillArea;
	readonly target: SkillTarget; // character target type
	readonly isAreaEffect: boolean; // pierces through enemies (takes whole skill area)
	readonly element: SkillElement; // fire, water, ...
	readonly physicalDamage: number; // damage modifier [%]
	readonly elementalDamage: number; // elemental damage modifier [%]
	readonly status: SkillStatus[]; // status effects added to attack
}

const elementAffinityTable = {
	[SkillElement.NONE]: null,
	[SkillElement.FIRE]: SkillElement.ICE,
	[SkillElement.ICE]: SkillElement.WIND,
	[SkillElement.WIND]: SkillElement.EARTH,
	[SkillElement.EARTH]: SkillElement.THUNDER,
	[SkillElement.THUNDER]: SkillElement.WATER,
	[SkillElement.WATER]: SkillElement.FIRE,
	[SkillElement.DARK]: SkillElement.HOLY,
	[SkillElement.HOLY]: SkillElement.DARK,
	[SkillElement.PSYCHIC]: SkillElement.PSYCHIC,
};

export class Skill {
	public static getElementModifier(offensiveElm: SkillElement, defensiveElm: SkillElement): number {
		if (elementAffinityTable[offensiveElm] === defensiveElm) {
			return 2;
		}
		if (elementAffinityTable[defensiveElm] === offensiveElm) {
			return 0.5;
		}
		return 1;
	}

	public static getTargetableArea(skill: ISkill, source: IPosition, gridSize: number): IPosition[] {
		if (SkillTarget.NONE === skill.target) {
			return [];
		}
		if (SkillTarget.SELF === skill.target) {
			return [source];
		}
		const range: number = skill.range;
		let targetable: IPosition[] = [];

		// get all tiles in range
		for (let x = -range; x <= range; x++) {
			for (let y = -range; y <= range; y++) {
				const pos = Position.create(source.x + x, source.y + y);

				if (!Position.isInGrid(pos, gridSize)) {
					continue;
				}
				targetable.push(pos);
			}
		}

		// filter diagonals and straight lines for LINE area skill type
		if (SkillArea.LINE === skill.area) {
			targetable = targetable.filter(pos => Position.isOnStraightLine(pos, source));
		}

		return targetable;
	}

	public static getTargets(actor: ICharacter, skill: ISkill, characters: ICharacter[], targetable: IPosition[]): IPosition[] {
		if (!targetable.length) {
			return [];
		}
		if (SkillTarget.SELF === skill.target) {
			return [actor.position];
		}
		let targets: ICharacter[];

		// get possible targets
		switch (skill.target) {
			case SkillTarget.ANY:
				targets = characters;
				break;

			case SkillTarget.ALLY:
				targets = characters.filter(char => char.player === actor.player);
				break;

			case SkillTarget.ENEMY:
				targets = characters.filter(char => char.player !== actor.player);
				break;
		}

		return targetable.filter(pos => Position.isContained(pos, targets.map(char => char.position)));
	}

	public static getEffectArea(skill: ISkill, source: IPosition, target: IPosition, gridSize: number): IPosition[] {
		let effect: IPosition[] = [];

		switch (skill.area) {
			case SkillArea.SINGLE:
				effect.push(target);
				break;

			case SkillArea.LINE:
				const diffX = target.x - source.x;
				const diffY = target.y - source.y;
				const absDiffX = Math.abs(diffX);
				const absDiffY = Math.abs(diffY);
				const dirX = (diffX / absDiffX) || 0;
				const dirY = (diffY / absDiffY) || 0;

				for (let i = 1; i <= skill.range; i++ ) {
					effect.push(Position.create(source.x + i * dirX, source.y + i * dirY));
				}
				break;

			case SkillArea.CROSS:
				effect = [target, ...Position.getSideTiles(target, [], gridSize)];
				break;

			case SkillArea.NEIGHBOURS:
				effect = Position.getNeighbours(source, [], gridSize);
				break;

			case SkillArea.AOE3x3:
				effect = [target, ...Position.getNeighbours(target, [], gridSize)];
				break;

			default:
				throw new Error(`Unsupported skill area: ${skill.area}`);
		}

		return effect.filter(pos => Position.isInGrid(pos, gridSize));
	}

	public static getEffectTargets(actor: ICharacter, skill: ISkill, effectArea: IPosition[], characters: ICharacter[]): IPosition[] {
		if (SkillTarget.NONE === skill.target) {
			return [];
		}
		const targets: IPosition[] = [];

		for (const char of characters) {
			const pos = char.position;
			const isInArea = Position.isContained(pos, effectArea);

			if (!isInArea) {
				continue;
			}
			switch (skill.target) {
				case SkillTarget.SELF:
					if (actor.data.id === char.data.id) {
						targets.push(pos);
					}
					break;

				case SkillTarget.ALLY:
					if (actor.player === char.player) {
						targets.push(pos);
					}
					break;

				case SkillTarget.ENEMY:
					if (actor.player !== char.player) {
						targets.push(pos);
					}
					break;

				case SkillTarget.ANY:
					targets.push(pos);
					break;

				default:
					throw new Error(`Invalid skill target: ${skill.target}`);
			}
		}
		return targets;
	}
}
