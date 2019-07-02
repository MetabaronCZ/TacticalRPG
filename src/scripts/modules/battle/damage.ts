import Skills from 'data/skills';
import Weapons from 'data/weapons';
import StatusEffects from 'data/status-effects';
import { backAttackModifier, affinityModifierTable } from 'data/damage';

import Skill from 'modules/skill';
import Character from 'modules/character';
import { Vector2D } from 'modules/geometry/vector';
import { IStatusEffect } from 'modules/battle/status-effect';
import { ElementAffinityTable, Affinity } from 'modules/skill/affinity';
import { SkillID, SkillElement, ISkillData } from 'modules/skill/skill-data';

interface IBlockValue {
	physical: number;
	magical: number;
}

interface IShieldValue {
	physical: number;
	magical: number;
	cost: number;
}

export interface ICombatInfo {
	attack: {
		character: Character;
		backAttack: boolean;
		damage: Array<{
			skill: Skill;
			physical: number;
			magical: number;
			status: IStatusEffect[];
			affinity: Affinity;
		}>
	};
	defense: {
		character: Character;
		physical: number;
		magical: number;
		block: number | null;
		shield: number | null;
		statusModifier: number;
	};
}

export interface IDamage {
	attacker: Character;
	defender: Character;
	skill: Skill;
	physical: number;
	magical: number;
	affinity: Affinity;
	backAttack: boolean;
	blocked: IBlockValue | null;
	shielded: IShieldValue | null;
	status: IStatusEffect[];
}

const isBackAttacked = (attacker: Character, defender: Character): boolean => {
	const attVector = Vector2D.fromTiles(attacker.position, defender.position);
	const defVector = Vector2D.fromDirection(defender.direction);
	const angle = attVector.getAngle(defVector);
	return angle < Math.PI / 2;
};

const getAffinity = (attacker: SkillElement, defender: SkillElement): Affinity => {
	if (ElementAffinityTable[attacker] === defender) {
		return 'ELEMENTAL_STRONG';
	}
	if (ElementAffinityTable[defender] === attacker) {
		return 'ELEMENTAL_WEAK';
	}
	return 'ELEMENTAL_NEUTRAL';
};

const getAffinityModifier = (affinity: Affinity): number => {
	return affinityModifierTable[affinity];
};

const getDirectionalModifier = (backAttacked: boolean): number => {
	return backAttacked ? backAttackModifier : 1;
};

const getBlock = (defender: Character): number | null => {
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
			return (shield.block || 0) * (skill.block || 1);
		}
	}
	return null;
};

const getBlockValue = (physical: number, magical: number, block: number | null): IBlockValue | null => {
	if (null === block) {
		return null;
	}
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
};

const getShield = (defender: Character): number | null => {
	if (!defender.status.has('ENERGY_SHIELD')) {
		return null;
	}
	return defender.attributes.MP;
};

const getShieldValue = (physical: number, magical: number, shield: number | null): IShieldValue | null => {
	if (null === shield) {
		return null;
	}
	const dmg = physical + magical;

	if (dmg <= shield) {
		return { physical, magical, cost: dmg };
	}
	const phyRatio = physical / (physical + magical);
	const phyBlock = Math.round(shield * phyRatio);
	const magBlock = shield - phyBlock;

	return {
		physical: phyBlock,
		magical: magBlock,
		cost: shield
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

export const getCombatInfo = (attacker: Character, defender: Character, skills: Skill[]): ICombatInfo => {
	return {
		attack: {
			character: attacker,
			backAttack: isBackAttacked(attacker, defender),
			damage: skills.map(skill => ({
				skill,
				physical: getPhysicalDamage(attacker, skill),
				magical: getMagicalDamage(attacker, skill),
				status: getStatusEffects(attacker, defender, skill),
				affinity: getAffinity(skill.element, defender.skillset.element)
			}))
		},
		defense: {
			character: defender,
			physical: defender.armor.physical,
			magical: defender.armor.magical,
			block: getBlock(defender),
			shield: getShield(defender),
			statusModifier: getStatusModifier(defender)
		}
	};
};

export const getDamage = (attacker: Character, defender: Character, skill: Skill): IDamage => {
	const info = getCombatInfo(attacker, defender, [skill]);

	const { backAttack } = info.attack;
	const attack = info.attack.damage[0];
	const { physical: armPhyMod, magical: armMagMod, statusModifier, block, shield } = info.defense;

	let { physical, magical } = attack;
	const { affinity } = attack;

	const affinityMod = getAffinityModifier(affinity);
	const directionMod = getDirectionalModifier(backAttack);

	// shield block
	const blocked = getBlockValue(physical, magical, block);

	if (blocked) {
		physical -= blocked.physical;
		magical -= blocked.magical;
	}

	// energy shield
	const shielded = getShieldValue(physical, magical, shield);

	if (shielded) {
		physical -= shielded.physical;
		magical -= shielded.magical;
	}

	// apply modifiers
	if (physical > 0) {
		physical *= directionMod * statusModifier * armPhyMod;
	}

	if (magical > 0) {
		magical *= directionMod * statusModifier * affinityMod * armMagMod;
	}

	// clamp values
	physical = physical > 0 ? Math.round(physical) : 0;
	magical = magical > 0 ? Math.round(magical) : 0;

	return {
		attacker,
		defender,
		skill,
		physical,
		magical,
		affinity,
		backAttack,
		blocked,
		shielded,
		status: attack.status
	};
};
