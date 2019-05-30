import Skills from 'data/skills';
import Weapons from 'data/weapons';
import StatusEffects from 'data/status-effects';

import Skill from 'modules/skill';
import Character from 'modules/character';
import { Vector2D } from 'modules/geometry/vector';
import { IStatusEffect } from 'modules/battle/status-effect';
import { ElementAffinityTable } from 'modules/skill/affinity';
import { SkillID, SkillElement, ISkillData } from 'modules/skill/skill-data';

const backAttackModifier = 2;
const elementWeakModifier = 2;
const elementStrongModifier = 0.5;

interface IBlockValue {
	physical: number;
	magical: number;
}

interface IShieldValue {
	physical: number;
	magical: number;
	cost: number;
}

interface IDamageInfo {
	physical: number;
	magical: number;
	blockModifier: IBlockValue | null;
	shieldModifier: IShieldValue | null;
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

const getDirectionalModifier = (attacker: Character, defender: Character): number => {
	const backAttackMod = isBackAttacked(attacker, defender) ? backAttackModifier : 1;
	return backAttackMod;
};

const getBlockValue = (defender: Character, physical: number, magical: number): IBlockValue | null => {
	const hasShield = ('SHIELD' === defender.offHand.type);

	if (hasShield) {
		const shield = defender.offHand;
		let skill: ISkillData | null = null;

		if (defender.status.has('BLOCK_SMALL')) {
			skill = Skills.get('SHD_SMALL_BLOCK');
		}

		if (defender.status.has('BLOCK_LARGE')) {
			skill = Skills.get('SHD_LARGE_BLOCK');
		}

		if (skill) {
			const block = (shield.block || 0) * (skill.block || 1);
			const dmg = physical + magical;

			if (dmg <= block) {
				return { physical, magical };
			}
			const phyRatio = physical / (physical + magical);
			const phyBlock = Math.round(block * phyRatio);
			const magBlock = block - phyBlock;

			return {
				physical: phyBlock,
				magical: magBlock
			};
		}
	}
	return null;
};

const getShieldValue = (defender: Character, physical: number, magical: number): IShieldValue | null => {
	if (!defender.status.has('ENERGY_SHIELD')) {
		return null;
	}
	const block = defender.attributes.MP;
	const dmg = physical + magical;

	if (dmg <= block) {
		return { physical, magical, cost: dmg };
	}
	const phyRatio = physical / (physical + magical);
	const phyBlock = Math.round(block * phyRatio);
	const magBlock = block - phyBlock;

	return {
		physical: phyBlock,
		magical: magBlock,
		cost: block
	};
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
	const directionModifier = getDirectionalModifier(attacker, defender);
	const armorPhyModifier = defender.armor.physical;
	const armorMagModifier = defender.armor.magical;
	const statusModifier = getStatusModifier(defender);
	const status = getStatusEffects(attacker, defender, skill);

	let physical = getPhysicalDamage(attacker, skill);
	let magical = getMagicalDamage(attacker, skill);

	// shield block
	const blocked = getBlockValue(defender, physical, magical);

	if (null !== blocked) {
		physical -= blocked.physical;
		magical -= blocked.magical;
	}

	// energy shield
	const shielded = getShieldValue(defender, physical, magical);

	if (null !== shielded) {
		physical -= shielded.physical;
		magical -= shielded.magical;
	}

	// apply modifiers
	if (physical > 0) {
		physical *= directionModifier * statusModifier * armorPhyModifier;
	}

	if (magical > 0) {
		magical *= directionModifier * statusModifier * elementalModifier * armorMagModifier;
	}

	// clamp values
	physical = physical > 0 ? Math.round(physical) : 0;
	magical = magical > 0 ? Math.round(magical) : 0;

	return {
		physical,
		magical,
		blockModifier: blocked,
		shieldModifier: shielded,
		elementalModifier,
		directionModifier,
		statusModifier,
		status
	};
};
