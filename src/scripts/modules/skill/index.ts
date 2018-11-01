import Skills, { attackSkills } from 'data/skills';

import Character from 'modules/character';
import Position from 'modules/geometry/position';
import { getPosition } from 'modules/geometry/positions';
import { StatusEffectID } from 'modules/battle/status-effect';
import {
	SkillID, SkillType, SkillElement, SkillGrade,
	SkillRange, SkillArea, SkillTarget, ISkillData
} from 'modules/skill/skill-data';

type ITargetTable = {
	[id in SkillTarget]: (character: Character, actor: Character) => boolean;
};

type IAreaTable = {
	[id in SkillArea]: (source: Position, target: Position, range: SkillRange) => Position[];
};

// SkillTarget based targetable logic
const targetTable: ITargetTable = {
	SELF:  (char: Character, actor: Character) => actor === char,
	ALLY:  (char: Character, actor: Character) => actor.player === char.player,
	ENEMY: (char: Character, actor: Character) => actor.player !== char.player,
	NONE:  (char: Character, actor: Character) => false,
	ANY:   (char: Character, actor: Character) => true
};

// SkillArea based area position getters
const areaTable: IAreaTable = {
	SINGLE: (source: Position, target: Position) => [target],
	LINE: (source: Position, target: Position, range: SkillRange) => {
		const diffX = target.x - source.x;
		const diffY = target.y - source.y;
		const dirX = (diffX / Math.abs(diffX)) || 0;
		const dirY = (diffY / Math.abs(diffY)) || 0;
		const area: Position[] = [];

		for (let i = 1; i <= range; i++ ) {
			const pos = getPosition(source.x + i * dirX, source.y + i * dirY);

			if (null !== pos) {
				area.push(pos);
			}
		}
		return area;
	},
	CROSS:      (source: Position, target: Position) => [target, ...target.getSideTiles()],
	NEIGHBOURS: (source: Position, target: Position) => source.getNeighbours(),
	AOE3x3:     (source: Position, target: Position) => [target, ...target.getNeighbours()]
};

const reactableSkillTargets: SkillTarget[] = ['ANY', 'ENEMY'];

class Skill implements ISkillData {
	public readonly id: SkillID;
	public readonly title: string;
	public readonly cost: number; // AP cost
	public readonly type: SkillType;
	public readonly grade: SkillGrade;
	public readonly range: SkillRange;
	public readonly area: SkillArea;
	public readonly target: SkillTarget; // character target type
	public readonly element: SkillElement; // fire, water, ...
	public readonly isFixedPhysicalDamage: boolean;
	public readonly physicalDamage: number; // damage modifier [%]
	public readonly elementalDamage: number; // elemental damage modifier [%]
	public readonly status: StatusEffectID[]; // status effects added to attack
	public readonly isAttackSkill: boolean;

	constructor(id: SkillID) {
		const data = Skills.get(id);
		this.id = id;
		this.title = data.title;
		this.cost = data.cost;
		this.type = data.type;
		this.grade = data.grade || 0;
		this.range = data.range;
		this.area = data.area;
		this.target = data.target || 'NONE';
		this.element = data.element || 'NONE';
		this.isFixedPhysicalDamage = data.isFixedPhysicalDamage || false;
		this.physicalDamage = data.physicalDamage || 0;
		this.elementalDamage = data.elementalDamage || 0;
		this.status = data.status || [];
		this.isAttackSkill = (-1 !== attackSkills.indexOf(this.id));
	}

	public static filterAttack(ids: SkillID[]): Skill[] {
		return ids.map(id => new Skill(id))
			.filter(skill => 'ACTIVE' === skill.type && skill.isAttackSkill);
	}

	public static filterSpecial(ids: SkillID[]): Skill[] {
		return ids.map(id => new Skill(id))
			.filter((skill, i, self) => {
				return (
					'ACTIVE' === skill.type &&
					!skill.isAttackSkill &&
					i === self.indexOf(skill) // skill unique in result array
				);
			});
	}

	public isReactable(): boolean {
		return -1 !== reactableSkillTargets.indexOf(this.target);
	}

	public getTargetable(source: Position): Position[] {
		const { target, range, area } = this;

		if ('NONE' === target) {
			return [];
		}
		if ('SELF' === target) {
			return [source];
		}
		let targetable: Position[] = [];

		// get all tiles in range
		for (let x = -range; x <= range; x++) {
			for (let y = -range; y <= range; y++) {
				const pos = getPosition(source.x + x, source.y + y);

				if (null === pos) {
					continue;
				}
				targetable.push(pos);
			}
		}

		// filter diagonals and straight lines for LINE area skill type
		if ('LINE' === area) {
			targetable = targetable.filter(pos => pos.isOnStraightLine(source));
		}

		return targetable;
	}

	public getTargets(actor: Character, characters: Character[], targetable: Position[]): Character[] {
		return characters
			.filter(char => {
				return (
					!char.isDead() &&
					char.position.isContained(targetable) &&
					targetTable[this.target](char, actor) // character is targetable
				);
			});
	}

	public getEffectArea(source: Position, target: Position): Position[] {
		return areaTable[this.area](source, target, this.range);
	}
}

export default Skill;
