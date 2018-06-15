import { SkillType, SkillRange, SkillArea, SkillTarget, SkillElement, SkillStatus } from 'modules/skill/attributes';
import { JobSkills } from 'modules/skill/job';
import { JobSkillID } from 'modules/skill/job/types';
import { WeaponSkills } from 'modules/skill/weapon';
import { WeaponSkillID } from 'modules/skill/weapon/types';
import { IPosition, Position } from 'modules/position';
import { ICharacter, Character } from 'modules/character';

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
	[SkillElement.PSYCHIC]: SkillElement.PSYCHIC
};

const getElementModifier = (offensiveElm: SkillElement, defensiveElm: SkillElement): number => {
	if (elementAffinityTable[offensiveElm] === defensiveElm) {
		return 2;
	}
	if (elementAffinityTable[defensiveElm] === offensiveElm) {
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

const getEffectTargets = (actor: ICharacter, skill: ISkill, effectArea: IPosition[], characters: ICharacter[]): IPosition[] => {
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
				if (Character.isEqual(actor, char)) {
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
};

const getByID = (ids: WeaponSkillID[]|JobSkillID[]): ISkill[] => {
	if (!ids.length) {
		return [];
	}
	if (WeaponSkills.get(ids[0] as WeaponSkillID)) {
		ids = ids as WeaponSkillID[];
		return ids.map(id => WeaponSkills.get(id));
	} else {
		ids = ids as JobSkillID[];
		return ids.map(id => JobSkills.get(id));
	}
};

export const Skill = {
	getElementModifier,
	getTargetableArea,
	getTargets,
	getEffectArea,
	getEffectTargets,
	getByID
};
