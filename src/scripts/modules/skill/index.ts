import Position from 'modules/position';
import Character from 'modules/character';
import MagicSkills from 'modules/skill/magic';
import WeaponSkills from 'modules/skill/weapon';
import ArchetypeSkills from 'modules/skill/archetype';

import { IPosition } from 'modules/position/types';
import { ICharacter } from 'modules/character/types';
import { ISkill, SkillID } from 'modules/skill/types';
import { MagicSkillID } from 'modules/skill/magic/types';
import { WeaponSkillID } from 'modules/skill/weapon/types';
import { ElementAffinityTable } from 'modules/skill/affinity';
import { ArchetypeSkillID } from 'modules/skill/archetype/types';
import { SkillArea, SkillTarget, SkillElement } from 'modules/skill/attributes';

const getElementModifier = (attacker: SkillElement, defender: SkillElement): number => {
	if (ElementAffinityTable[attacker] === defender) {
		return 2;
	}
	if (ElementAffinityTable[defender] === attacker) {
		return 0.5;
	}
	return 1;
};

const getTargetableArea = (skill: ISkill, source: IPosition): IPosition[] => {
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

			if (!Position.isInGrid(pos)) {
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
};

const getTargets = (actor: ICharacter, skill: ISkill, characters: ICharacter[], targetable: IPosition[]): IPosition[] => {
	if (!targetable.length) {
		return [];
	}

	if (SkillTarget.SELF === skill.target) {
		return [actor.position];
	}
	let targets: ICharacter[] = [];

	// remove dead characters
	characters = characters.filter(char => !Character.isDead(char));

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

	if (!targets.length) {
		return [];
	}
	const targetPositions = targets.map(char => char.position);
	return targetable.filter(pos => Position.isContained(pos, targetPositions));
};

const getEffectArea = (skill: ISkill, source: IPosition, target: IPosition): IPosition[] => {
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
			effect = [target, ...Position.getSideTiles(target)];
			break;

		case SkillArea.NEIGHBOURS:
			effect = Position.getNeighbours(source);
			break;

		case SkillArea.AOE3x3:
			effect = [target, ...Position.getNeighbours(target)];
			break;

		default:
			throw new Error(`Unsupported skill area: ${skill.area}`);
	}

	return effect.filter(pos => Position.isInGrid(pos));
};

const getEffectTargets = (actor: ICharacter, skill: ISkill, effectArea: IPosition[], characters: ICharacter[]): string[] => {
	if (SkillTarget.NONE === skill.target) {
		return [];
	}
	const targets: string[] = [];

	// remove dead characters
	characters = characters.filter(char => !Character.isDead(char));

	for (const char of characters) {
		const id = char.data.id;
		const pos = char.position;
		const isInArea = Position.isContained(pos, effectArea);

		if (!isInArea) {
			continue;
		}
		switch (skill.target) {
			case SkillTarget.SELF:
				if (Character.isEqual(actor, char)) {
					targets.push(id);
				}
				break;

			case SkillTarget.ALLY:
				if (actor.player === char.player) {
					targets.push(id);
				}
				break;

			case SkillTarget.ENEMY:
				if (actor.player !== char.player) {
					targets.push(id);
				}
				break;

			case SkillTarget.ANY:
				targets.push(id);
				break;

			default:
				throw new Error(`Invalid skill target: ${skill.target}`);
		}
	}
	return targets;
};

const getByID = (ids: SkillID[]): ISkill[] => {
	if (!ids.length) {
		return [];
	}
	if (ids[0] in WeaponSkillID) {
		return (ids as WeaponSkillID[]).map(id => WeaponSkills.get(id));
	} else if (ids[0] in MagicSkillID) {
		return (ids as MagicSkillID[]).map(id => MagicSkills.get(id));
	} else {
		return (ids as ArchetypeSkillID[]).map(id => ArchetypeSkills.get(id));
	}
};

const Skill = {
	getElementModifier,
	getTargetableArea,
	getTargets,
	getEffectArea,
	getEffectTargets,
	getByID
};

export default Skill;
