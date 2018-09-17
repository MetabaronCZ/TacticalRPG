import Skills from 'data/skills';

import Position from 'engine/position';
import Character from 'engine/character';
import { getPosition } from 'engine/positions';
import { StatusEffectID } from 'engine/status-effect';
import { SkillID, SkillType, SkillRange, SkillArea, SkillElement, SkillTarget } from 'engine/skill/skill-data';

class Skill {
	public readonly id: SkillID;
	public readonly title: string;
	public readonly cost: number; // AP cost
	public readonly type: SkillType;
	public readonly range: SkillRange;
	public readonly area: SkillArea;
	public readonly target: SkillTarget; // character target type
	public readonly element: SkillElement; // fire, water, ...
	public readonly isFixedPhysicalDamage: boolean;
	public readonly physicalDamage: number; // damage modifier [%]
	public readonly elementalDamage: number; // elemental damage modifier [%]
	public readonly status: StatusEffectID[]; // status effects added to attack

	constructor(id: SkillID) {
		const data = Skills.get(id);
		this.id = id;
		this.title = data.title;
		this.cost = data.cost;
		this.type = data.type;
		this.range = data.range;
		this.area = data.area;
		this.target = data.target || 'NONE';
		this.element = data.element || 'NONE';
		this.isFixedPhysicalDamage = data.isFixedPhysicalDamage || false;
		this.physicalDamage = data.physicalDamage || 0;
		this.elementalDamage = data.elementalDamage || 0;
		this.status = data.status || [];
	}

	public getTargetable( source: Position): Position[] {
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

	public getTargets(actor: Character, characters: Character[], targetable: Position[]): Position[] {
		if (!targetable.length) {
			return [];
		}
		const { target } = this;

		if ('SELF' === target) {
			return [actor.position];
		}
		let targets: Character[] = [];

		// remove dead characters
		characters = characters.filter(char => !char.isDead());

		// get possible targets
		switch (target) {
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

	public getEffectArea(source: Position, target: Position): Position[] {
		const { area, range } = this;
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

				for (let i = 1; i <= range; i++ ) {
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

	public getEffectTargets(actor: Character, effectArea: Position[], characters: Character[]): Character[] {
		const { target } = this;

		if ('NONE' === target) {
			return [];
		}
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

export default Skill;
