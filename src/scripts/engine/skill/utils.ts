import { attackSkills } from 'data/skills';

import Skill from 'engine/skill';
import Position from 'engine/position';
import Character from 'engine/character';
import { getPosition } from 'engine/positions';
import { ElementAffinityTable } from 'engine/skill/affinity';
import { SkillID, SkillElement } from 'engine/skill/skill-data';

const isAttackSkill = (id: SkillID): boolean => -1 !== attackSkills.indexOf(id);

class SkillUtils {
	public static filterAttack(ids: SkillID[]): Skill[] {
		const skills: Skill[] = [];

		for (const id of ids) {
			const skill = new Skill(id);

			if ('ACTIVE' === skill.type && isAttackSkill(id)) {
				skills.push(skill);
			}
		}
		return skills;
	}

	public static filterSpecial(ids: SkillID[]): Skill[] {
		const skills: Skill[] = [];
		const uniqueSkills: SkillID[] = [];

		for (const id of ids) {
			const skill = new Skill(id);

			if ('ACTIVE' === skill.type && !isAttackSkill(id) && -1 === uniqueSkills.indexOf(id)) {
				uniqueSkills.push(id);
				skills.push(skill);
			}
		}
		return skills;
	}

	public static getElementModifier(attacker: SkillElement, defender: SkillElement): number {
		if (ElementAffinityTable[attacker] === defender) {
			return 2;
		}
		if (ElementAffinityTable[defender] === attacker) {
			return 0.5;
		}
		return 1;
	}

	public static getTargetableArea(skill: Skill, source: Position): Position[] {
		if ('NONE' === skill.target) {
			return [];
		}
		if ('SELF' === skill.target) {
			return [source];
		}
		const range: number = skill.range;
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
		if ('LINE' === skill.area) {
			targetable = targetable.filter(pos => pos.isOnStraightLine(source));
		}

		return targetable;
	}

	public static getTargets(actor: Character, skill: Skill, characters: Character[], targetable: Position[]): Position[] {
		if (!targetable.length) {
			return [];
		}

		if ('SELF' === skill.target) {
			return [actor.position];
		}
		let targets: Character[] = [];

		// remove dead characters
		characters = characters.filter(char => !char.isDead());

		// get possible targets
		switch (skill.target) {
			case 'ANY':
				targets = characters;
				break;

			case 'ALLY':
				targets = characters.filter(char => char.player === actor.player);
				break;

			case 'ENEMY':
				targets = characters.filter(char => char.player !== actor.player);
				break;
		}

		if (!targets.length) {
			return [];
		}
		const targetPositions = targets.map(char => char.position);
		return targetable.filter(pos => pos.isContained(targetPositions));
	}

	public static getEffectArea(skill: Skill, source: Position, target: Position): Position[] {
		const area = skill.area;
		let effect: Position[] = [];

		switch (area) {
			case 'SINGLE':
				effect.push(target);
				break;

			case 'LINE':
				const diffX = target.x - source.x;
				const diffY = target.y - source.y;
				const absDiffX = Math.abs(diffX);
				const absDiffY = Math.abs(diffY);
				const dirX = (diffX / absDiffX) || 0;
				const dirY = (diffY / absDiffY) || 0;

				for (let i = 1; i <= skill.range; i++ ) {
					const pos = getPosition(source.x + i * dirX, source.y + i * dirY);

					if (null !== pos) {
						effect.push(pos);
					}
				}
				break;

			case 'CROSS':
				effect = [target, ...target.getSideTiles()];
				break;

			case 'NEIGHBOURS':
				effect = source.getNeighbours();
				break;

			case 'AOE3x3':
				effect = [target, ...target.getNeighbours()];
				break;

			default:
				throw new Error(`Unsupported skill area: ${area}`);
		}

		return effect;
	}

	public static getEffectTargets(actor: Character, skill: Skill, effectArea: Position[], characters: Character[]): Character[] {
		if ('NONE' === skill.target) {
			return [];
		}
		const target = skill.target;
		const targets: Character[] = [];

		// remove dead characters
		characters = characters.filter(char => !char.isDead());

		for (const char of characters) {
			const isInArea = char.position.isContained(effectArea);

			if (!isInArea) {
				continue;
			}
			switch (target) {
				case 'SELF':
					if (actor === char) {
						targets.push(char);
					}
					break;

				case 'ALLY':
					if (actor.player === char.player) {
						targets.push(char);
					}
					break;

				case 'ENEMY':
					if (actor.player !== char.player) {
						targets.push(char);
					}
					break;

				case 'ANY':
					targets.push(char);
					break;

				default:
					throw new Error(`Invalid skill target: ${target}`);
			}
		}
		return targets;
	}
}

export default SkillUtils;
