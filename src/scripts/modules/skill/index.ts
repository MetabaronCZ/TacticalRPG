import Skills, { attackSkills } from 'data/skills';

import { getUniqueItems } from 'core/array';

import { getVisible } from 'modules/pathfinding/hit-scan';
import { getTile, getTiles } from 'modules/geometry/tiles';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import { WeaponID } from 'modules/equipment/weapon-data';
import { StatusEffectID } from 'modules/battle/status-effect';
import {
	SkillID, SkillType, SkillElement, SkillGrade,
	SkillRange, SkillArea, SkillTarget, ISkillData, SkillCooldown
} from 'modules/skill/skill-data';

type ITargetTable = {
	readonly [id in SkillTarget]: (character: Character, actor: Character) => boolean;
};

type IAreaTable = {
	readonly [id in SkillArea]: (source: Tile, target: Tile, range: SkillRange) => Tile[];
};

// SkillTarget based targetable logic
const targetTable: ITargetTable = {
	SELF:  (char: Character, actor: Character) => actor === char,
	ALLY:  (char: Character, actor: Character) => actor.player === char.player,
	ENEMY: (char: Character, actor: Character) => actor.player !== char.player,
	NONE:  () => false,
	ANY:   () => true
};

// SkillArea based area tile getters
const areaTable: IAreaTable = {
	SINGLE: (source: Tile, target: Tile) => [target],
	LINE: (source: Tile, target: Tile, range: SkillRange) => {
		const diffX = target.x - source.x;
		const diffY = target.y - source.y;
		const diffZ = target.z - source.z;
		const dirX = (diffX / Math.abs(diffX)) || 0;
		const dirY = (diffY / Math.abs(diffY)) || 0;
		const dirZ = (diffZ / Math.abs(diffZ)) || 0;
		const area: Tile[] = [];

		for (let i = 1; i <= range; i++ ) {
			const tile = getTile(source.x + i * dirX, source.y + i * dirY, source.z + i * dirZ);

			if (tile) {
				area.push(tile);
			}
		}
		return area;
	},
	NEIGHBOURS: (source: Tile) => source.getNeighbours(),
	AOE3x3:     (source: Tile, target: Tile) => [target, ...target.getNeighbours()]
};

// targetable circle area
const getCircleArea = (center: Tile, radius: number): Tile[] => {
	const circle: Tile[] = [center];

	for (let i = 1; i <= radius; i++) {
		const neighbours = circle
			.map(tile => tile.getNeighbours())
			.reduce((a, b) => a.concat(b));

		const unique = getUniqueItems(neighbours);

		for (const tile of unique) {
			if (-1 === circle.indexOf(tile)) {
				circle.push(tile);
			}
		}
	}
	return circle;
};

const reactableSkillTargets: SkillTarget[] = ['ANY', 'ENEMY'];

class Skill implements ISkillData {
	public readonly id: SkillID;
	public readonly title: string;
	public readonly apCost: number;
	public readonly mpCost: number;
	public readonly type: SkillType;
	public readonly grade: SkillGrade;
	public readonly range: SkillRange;
	public readonly area: SkillArea;
	public readonly target: SkillTarget; // character target type
	public readonly weapon: WeaponID;
	public readonly element: SkillElement;
	public readonly hitScan: boolean;
	public readonly isFixedDamage: boolean;
	public readonly physical: number; // damage modifier [%]
	public readonly magical: number; // magical damage modifier [%]
	public readonly block: number; // block modifier [%]
	public readonly status: StatusEffectID[]; // status effects added to attack
	public readonly cooldown: SkillCooldown;
	public readonly isAttackSkill: boolean;

	constructor(id: SkillID) {
		const data = Skills.get(id);
		this.id = id;
		this.title = data.title;
		this.apCost = data.apCost || 0;
		this.mpCost = data.mpCost || 0;
		this.type = data.type;
		this.grade = data.grade || 0;
		this.range = data.range;
		this.area = data.area;
		this.target = data.target || 'NONE';
		this.weapon = data.weapon || 'NONE';
		this.element = data.element || 'NONE';
		this.hitScan = data.hitScan || false;
		this.isFixedDamage = data.isFixedDamage || false;
		this.physical = data.physical;
		this.magical = data.magical;
		this.block = data.block || 1;
		this.status = data.status || [];
		this.cooldown = data.cooldown || 0;
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

	public getTargetable(source: Tile, hitScanObstacles: Tile[]): Tile[] {
		const { target, range, area, hitScan } = this;

		if ('NONE' === target) {
			return [];
		}
		if ('SELF' === target) {
			return [source];
		}
		let targetable: Tile[] = [];

		if ('ULTIMATE' === range) {
			targetable = getTiles();
		} else {
			targetable = getCircleArea(source, range);
		}

		// filter diagonals and straight lines for LINE area skill type
		if ('LINE' === area) {
			targetable = targetable.filter(tile => tile.isOnStraightLine(source));
		}

		// apply hit-scan filter
		if (hitScan) {
			targetable = getVisible(targetable, source, hitScanObstacles);
		}

		if ('ENEMY' === target) {
			// remove source
			targetable = targetable.filter(tile => tile !== source);
		}
		return targetable;
	}

	public getTargets(source: Character, characters: Character[], targetable: Tile[]): Character[] {
		return characters.filter(char => {
			const isDying = char.status.has('DYING');
			return (
				!char.isDead() &&
				char.position.isContained(targetable) &&
				targetTable[this.target](char, source) && // character is targetable
				('HOL_REVIVE' === this.id ? isDying : !isDying)
			);
		});
	}

	public getEffectArea(source: Tile, target: Tile): Tile[] {
		return areaTable[this.area](source, target, this.range);
	}

	public getGradeTitle(): string {
		return ['I', 'II', 'III'][this.grade - 1];
	}
}

export default Skill;
