import Weapons from 'data/weapons';
import StatusEffects from 'data/status-effects';
import { smallShieldBlock } from 'data/game-config';

import Skill from 'modules/skill';
import Character from 'modules/character';
import { Vector2D } from 'modules/geometry/vector';
import { StatusEffectID } from 'modules/battle/status-effect';
import { ElementAffinityTable } from 'modules/skill/affinity';
import { SkillID, SkillElement } from 'modules/skill/skill-data';

const backAttackModifier = 2;
const elementWeakModifier = 2;
const elementStrongModifier = 0.5;

interface IDamageInfo {
	physical: number;
	elemental: number;
	blockModifier: number;
	elementalModifier: number;
	directionModifier: number;
	status: StatusEffectID[];
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
	const attVector = Vector2D.fromPositions(attacker.position, defender.position);
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

const getPhysicalDamage = (attacker: Character, defender: Character, skill: Skill): number => {
	const defArmor = defender.armor;
	const attWeapon = Weapons.values().find(wpn => -1 !== (wpn.skills as SkillID[]).indexOf(skill.id));
	const defArmorDefense = defArmor.physicalDefense;
	const attWeaponDamage = (attWeapon ? attWeapon.damage : 1);

	const defense = (1 - defender.attributes.VIT / 100) * (1 - defArmorDefense / 100);
	let attack = 0;

	if (skill.isFixedPhysicalDamage) {
		attack = skill.physicalDamage;
	} else {
		attack = attacker.attributes.STR * attWeaponDamage * skill.physicalDamage;
	}

	return attack * defense;
};

const getElementalDamage = (attacker: Character, defender: Character, skill: Skill): number => {
	const main = attacker.mainHand;
	const off = attacker.offHand;
	const armor = defender.armor;
	const armorDefense = armor.magicalDefense;
	const magBonus = main.magic + off.magic;

	const attack = (attacker.attributes.MAG + magBonus) * skill.elementalDamage;
	const defense = (1 - defender.attributes.SPR / 100) * (1 - armorDefense / 100);

	return attack * defense;
};

const getStatusEffects = (attacker: Character, defender: Character, skill: Skill): StatusEffectID[] => {
	const statuses = skill.status.map(id => StatusEffects.get(id)());
	const { STR: attSTR, MAG: attMAG } = attacker.attributes;
	const { VIT: defVIT, SPR: defSPR } = defender.attributes;
	const effects: StatusEffectID[] = [];

	for (const status of statuses) {
		switch (status.type) {
			case 'PHYSICAL':
				if (attSTR >= defVIT) {
					effects.push(status.id);
				}
				break;

			case 'MAGICAL':
				if (attMAG >= defSPR) {
					effects.push(status.id);
				}
				break;

			case 'SUPPORT':
				effects.push(status.id);
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
	const status = getStatusEffects(attacker, defender, skill);

	let physical = getPhysicalDamage(attacker, defender, skill);
	let elemental = getElementalDamage(attacker, defender, skill);

	// apply modifiers
	physical = physical * directionModifier * blockModifier;
	elemental = elemental * directionModifier * elementalModifier;

	// clamp values
	physical = physical > 0 ? Math.round(physical) : 0;
	elemental = elemental > 0 ? Math.round(elemental) : 0;

	return {
		physical,
		elemental,
		blockModifier,
		elementalModifier,
		directionModifier,
		status
	};
};
