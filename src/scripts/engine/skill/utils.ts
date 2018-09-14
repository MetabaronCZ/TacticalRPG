import Position from 'engine/position';
import Character from 'engine/character';
import MagicSkills from 'engine/skill/magic';
import WeaponSkills from 'engine/skill/weapon';
import { getPosition } from 'engine/positions';
import ArchetypeSkills from 'engine/skill/archetype';
import { MagicSkillID } from 'engine/skill/magic/types';
import { WeaponSkillID } from 'engine/skill/weapon/types';
import { ArchetypeSkillID } from 'engine/skill/archetype';
import { ElementAffinityTable } from 'engine/skill/affinity';
import Skill, { SkillID, SkillElement } from 'engine/skill';

class SkillUtils {
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
		if (skill.isTarget('NONE')) {
			return [];
		}
		if (skill.isTarget('SELF')) {
			return [source];
		}
		const range: number = skill.getRange();
		let targetable: Position[] = [];

		// get all tiles in range
		for (let x = -range; x <= range; x++) {
			for (let y = -range; y <= range; y++) {
				const pos = getPosition(source.getX() + x, source.getY() + y);

				if (null === pos) {
					continue;
				}
				targetable.push(pos);
			}
		}

		// filter diagonals and straight lines for LINE area skill type
		if (skill.isArea('LINE')) {
			targetable = targetable.filter(pos => pos.isOnStraightLine(source));
		}

		return targetable;
	}

	public static getTargets(actor: Character, skill: Skill, characters: Character[], targetable: Position[]): Position[] {
		if (!targetable.length) {
			return [];
		}

		if (skill.isTarget('SELF')) {
			return [actor.getPosition()];
		}
		let targets: Character[] = [];

		// remove dead characters
		characters = characters.filter(char => !char.isDead());

		// get possible targets
		switch (skill.getTarget()) {
			case 'ANY':
				targets = characters;
				break;

			case 'ALLY':
				targets = characters.filter(char => char.getPlayer() === actor.getPlayer());
				break;

			case 'ENEMY':
				targets = characters.filter(char => char.getPlayer() !== actor.getPlayer());
				break;
		}

		if (!targets.length) {
			return [];
		}
		const targetPositions = targets.map(char => char.getPosition());
		return targetable.filter(pos => pos.isContained(targetPositions));
	}

	public static getEffectArea(skill: Skill, source: Position, target: Position): Position[] {
		const area = skill.getArea();
		let effect: Position[] = [];

		switch (area) {
			case 'SINGLE':
				effect.push(target);
				break;

			case 'LINE':
				const diffX = target.getX() - source.getX();
				const diffY = target.getY() - source.getY();
				const absDiffX = Math.abs(diffX);
				const absDiffY = Math.abs(diffY);
				const dirX = (diffX / absDiffX) || 0;
				const dirY = (diffY / absDiffY) || 0;

				for (let i = 1; i <= skill.getRange(); i++ ) {
					const pos = getPosition(source.getX() + i * dirX, source.getY() + i * dirY);

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
		if (skill.isTarget('NONE')) {
			return [];
		}
		const target = skill.getTarget();
		const targets: Character[] = [];

		// remove dead characters
		characters = characters.filter(char => !char.isDead());

		for (const char of characters) {
			const pos = char.getPosition();
			const isInArea = pos.isContained(effectArea);

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
					if (actor.getPlayer() === char.getPlayer()) {
						targets.push(char);
					}
					break;

				case 'ENEMY':
					if (actor.getPlayer() !== char.getPlayer()) {
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

	public static getByID(ids: SkillID[]): Skill[] {
		if (!ids.length) {
			return [];
		}
		if (this.isWeaponSkillID(ids[0])) {
			return (ids as WeaponSkillID[]).map(id => new Skill(WeaponSkills.get(id)));
		} else if (this.isMagicSkillID(ids[0])) {
			return (ids as MagicSkillID[]).map(id => new Skill(MagicSkills.get(id)));
		} else if (this.isArchetypeSkillID(ids[0])) {
			return (ids as ArchetypeSkillID[]).map(id => new Skill(ArchetypeSkills.get(id)));
		}
		throw new Error('Unsupported skill ID ' + ids[0]);
	}

	private static isWeaponSkillID(id: any): id is WeaponSkillID {
		return !!WeaponSkills.get(id);
	}

	private static isMagicSkillID(id: any): id is MagicSkillID {
		return !!MagicSkills.get(id);
	}

	private static isArchetypeSkillID(id: any): id is ArchetypeSkillID {
		return !!ArchetypeSkills.get(id);
	}
}

export default SkillUtils;
