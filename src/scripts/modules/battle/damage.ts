import Skills from 'data/skills';
import Weapons from 'data/weapons';
import StatusEffects from 'data/status-effects';

import Skill from 'modules/skill';
import Character from 'modules/character';
import { Vector2D } from 'modules/geometry/vector';
import { IStatusEffect } from 'modules/battle/status-effect';
import { ElementAffinityTable } from 'modules/skill/affinity';
import { SkillID, SkillElement } from 'modules/skill/skill-data';

const backAttackModifier = 2;
const elementWeakModifier = 2;
const elementStrongModifier = 0.5;

interface IBlockValue {
	physical: number;
	magical: number;
}

interface IDamageInfo {
	physical: number;
	magical: number;
	blockModifier: IBlockValue|null;
	elementalModifier: number;
	directionModifier: number;
	statusModifier: number;
	status: IStatusEffect[];
}

export const isBackAttacked = (attacker: Character, defender: Character): boolean => {
	const attVector = Vector2D.fromTiles(attacker.position, defender.position);
	const defVector = Vector2D.fromDirection(defender.direction);
	const angle = attVector.getAngle(defVector);
	return angle < Math.PI / 2;
};

const getElementModifier = (attacker: SkillElement, defender: SkillElement): number => {
	if (ElementAffinityTable[attacker] === defender) {
		return elementStrongModifier;
	}
	if (ElementAffinityTable[defender] === attacker) {
		return elementWeakModifier;
	}
	return 1;
};

const getDirectionalMadifier = (attacker: Character, defender: Character): number => {
	const backAttackMod = isBackAttacked(attacker, defender) ? backAttackModifier : 1;
	return backAttackMod;
};

const getBlockValue = (defender: Character): IBlockValue|null => {
	const hasShield = ('SHIELD' === defender.offHand.type);

	if (hasShield) {
		if (defender.status.has('BLOCK_SMALL')) {
			const skill = Skills.get('SHD_SMALL_BLOCK');
			return {
				physical: skill.physical || 0,
				magical: skill.magical || 0
			};
		}

		if (defender.status.has('BLOCK_LARGE')) {
			const skill = Skills.get('SHD_LARGE_BLOCK');
			return {
				physical: skill.physical || 0,
				magical: skill.magical || 0
			};
		}
	}
	return null;
};

const getPhysicalDamage = (attacker: Character, skill: Skill): number => {
	if (0 === skill.physical) {
		return 0;
	}
	const weapon = Weapons.values().find(wpn => -1 !== (wpn.skills as SkillID[]).indexOf(skill.id));
	const weaponDamage = (weapon ? weapon.physical : 0);

	if (skill.isFixedDamage) {
		return skill.physical;
	} else {
		return (attacker.attributes.STR + weaponDamage) * skill.physical;
	}
};

const getMagicalDamage = (attacker: Character, skill: Skill): number => {
	if (0 === skill.magical) {
		return 0;
	}
	const { mainHand, offHand } = attacker;
	const weaponDamage = mainHand.magical + offHand.magical;
	return (attacker.attributes.MAG + weaponDamage) * skill.magical;
};

const getStatusModifier = (defender: Character): number => {
	const { status } = defender;
	let mod = 1;

	if (status.has('SHOCK')) {
		mod *= 2;
	}
	if (status.has('IRON_SKIN')) {
		mod /= 2;
	}
	return mod;
};

const getStatusEffects = (attacker: Character, defender: Character, skill: Skill): IStatusEffect[] => {
	const statuses = skill.status.map(id => StatusEffects.get(id)(attacker, 0, 0));
	const { STR: attSTR, MAG: attMAG } = attacker.attributes;
	const { VIT: defVIT, SPR: defSPR } = defender.attributes;
	const effects: IStatusEffect[] = [];

	for (const status of statuses) {
		switch (status.type) {
			case 'PHYSICAL':
				if (attSTR >= defVIT) {
					effects.push(status);
				}
				break;

			case 'MAGICAL':
				if (attMAG >= defSPR) {
					effects.push(status);
				}
				break;

			case 'SUPPORT':
				effects.push(status);
				break;

			default:
				throw new Error('Unsupported status effect type: ' + status.type);
		}
	}
	return effects;
};

export const getDamageInfo = (attacker: Character, defender: Character, skill: Skill): IDamageInfo => {
	const elementalModifier = getElementModifier(skill.element, defender.skillset.element);
	const directionModifier = getDirectionalMadifier(attacker, defender);
	const blockValue = getBlockValue(defender);
	const statusModifier = getStatusModifier(defender);
	const status = getStatusEffects(attacker, defender, skill);

	let physical = getPhysicalDamage(attacker, skill);
	let magical = getMagicalDamage(attacker, skill);

	// apply modifiers
	physical *= directionModifier * statusModifier;
	magical *= directionModifier * statusModifier * elementalModifier;

	// apply block
	if (null !== blockValue) {
		physical -= blockValue.physical;
		magical -= blockValue.magical;
	}

	// clamp values
	physical = physical > 0 ? Math.round(physical) : 0;
	magical = magical > 0 ? Math.round(magical) : 0;

	return {
		physical,
		magical,
		blockModifier: blockValue,
		elementalModifier,
		directionModifier,
		statusModifier,
		status
	};
};
