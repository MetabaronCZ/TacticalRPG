import Weapons from 'data/weapons';
import StatusEffects from 'data/status-effects';
import { smallShieldBlock } from 'data/game-config';

import Skill from 'modules/skill';
import Character from 'modules/character';
import { Vector2D } from 'modules/geometry/vector';
import { IStatusEffect } from 'modules/battle/status-effect';
import { ElementAffinityTable } from 'modules/skill/affinity';
import { SkillID, SkillElement } from 'modules/skill/skill-data';

const backAttackModifier = 2;
const elementWeakModifier = 2;
const elementStrongModifier = 0.5;

interface IDamageInfo {
	physical: number;
	magical: number;
	blockModifier: number;
	elementalModifier: number;
	directionModifier: number;
	statusModifier: number;
	status: IStatusEffect[];
}

const getElementModifier = (attacker: SkillElement, defender: SkillElement): number => {
	if (ElementAffinityTable[attacker] === defender) {
		return elementStrongModifier;
	}
	if (ElementAffinityTable[defender] === attacker) {
		return elementWeakModifier;
	}
	return 1;
};

export const isBackAttack = (attacker: Character, defender: Character): boolean => {
	const attVector = Vector2D.fromTiles(attacker.position, defender.position);
	const defVector = Vector2D.fromDirection(defender.direction);
	const angle = attVector.getAngle(defVector);
	return angle < Math.PI / 2;
};

const getBlockModifier = (defender: Character): number => {
	const defHasShield = ('SHIELD' === defender.offHand.type);
	const defHasBlocked = defender.status.has('BLOCK_SMALL');
	let defBlock = 0;

	// small shield block
	if (defHasShield && defHasBlocked) {
		defBlock = smallShieldBlock;
	}

	return 1 - defBlock;
};

const getPhysicalDamage = (attacker: Character, skill: Skill): number => {
	const attWeapon = Weapons.values().find(wpn => -1 !== (wpn.skills as SkillID[]).indexOf(skill.id));
	const attWeaponDamage = (attWeapon ? attWeapon.damage : 1);

	if (skill.isFixedPhysicalDamage) {
		return skill.physicalDamage;
	} else {
		return attacker.attributes.STR * attWeaponDamage * skill.physicalDamage;
	}
};

const getMagicalDamage = (attacker: Character, skill: Skill): number => {
	const { mainHand, offHand } = attacker;
	const attWeaponMagic = (mainHand.magic + offHand.magic) || 1;

	return attacker.attributes.MAG * attWeaponMagic * skill.magicalDamage;
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
	const statuses = skill.status.map(id => StatusEffects.get(id)());
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
	const blockModifier = getBlockModifier(defender);
	const directionModifier = isBackAttack(attacker, defender) ? backAttackModifier : 1;
	const elementalModifier = getElementModifier(skill.element, defender.skillset.element);
	const statusModifier = getStatusModifier(defender);
	const status = getStatusEffects(attacker, defender, skill);

	let physical = getPhysicalDamage(attacker, skill);
	let magical = getMagicalDamage(attacker, skill);

	// apply modifiers
	physical *= directionModifier * statusModifier * blockModifier;
	magical *= directionModifier * statusModifier * elementalModifier;

	// clamp values
	physical = physical > 0 ? Math.round(physical) : 0;
	magical = magical > 0 ? Math.round(magical) : 0;

	return {
		physical,
		magical,
		blockModifier: 1 - blockModifier,
		elementalModifier,
		directionModifier,
		statusModifier,
		status
	};
};
