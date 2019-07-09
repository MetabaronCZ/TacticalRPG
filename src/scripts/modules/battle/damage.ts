import Skills from 'data/skills';
import Weapons from 'data/weapons';
import * as DMG from 'data/damage';

import Skill from 'modules/skill';
import Character from 'modules/character';
import { Vector2D } from 'modules/geometry/vector';
import StatusEffect from 'modules/battle/status-effect';
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
	status: StatusEffect[];
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
	return DMG.affinityModifierTable[affinity];
};

const getDirectionalModifier = (backAttacked: boolean): number => {
	return backAttacked ? DMG.backAttackModifier : 1;
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

const getStatusModifier = (attacker: Character, defender: Character): number => {
	let mod = 1;

	if (defender.status.has('SHOCK')) {
		mod *= DMG.shockModifier;
	}
	if (defender.status.has('IRON_SKIN')) {
		mod *= DMG.ironSkinModifier;
	}
	if (attacker.status.has('BERSERK')) {
		mod *= DMG.berserkAttackModifier;
	}
	if (defender.status.has('BERSERK')) {
		mod *= DMG.berserkDefenseModifier;
	}
	return mod;
};

const getStatusEffects = (attacker: Character, defender: Character, skill: Skill): StatusEffect[] => {
	const statuses = skill.status.map(id => new StatusEffect(id, attacker));
	const { STR: attSTR, MAG: attMAG } = attacker.attributes;
	const { VIT: defVIT, SPR: defSPR } = defender.attributes;
	const effects: StatusEffect[] = [];

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

export const getDamage = (attacker: Character, defender: Character, skill: Skill): IDamage => {
	// damage
	let physical = getPhysicalDamage(attacker, skill);
	let magical = getMagicalDamage(attacker, skill);

	// elemental affnity
	const affinity = getAffinity(skill.element, defender.skillset.element);
	const affinityMod = getAffinityModifier(affinity);

	// directional modifier
	const backAttack = isBackAttacked(attacker, defender);
	const directionMod = getDirectionalModifier(backAttack);

	// shield block
	const block = getBlock(defender);
	const blocked = getBlockValue(physical, magical, block);

	if (blocked) {
		physical -= blocked.physical;
		magical -= blocked.magical;
	}

	// energy shield
	const shield = getShield(defender);
	const shielded = getShieldValue(physical, magical, shield);

	if (shielded) {
		physical -= shielded.physical;
		magical -= shielded.magical;
	}

	// status modifiers
	const status = getStatusEffects(attacker, defender, skill);
	const statusModifier = getStatusModifier(attacker, defender);

	if (physical > 0) {
		physical *= directionMod * statusModifier * defender.armor.physical;
	}

	if (magical > 0) {
		magical *= directionMod * statusModifier * affinityMod * defender.armor.magical;
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
		status
	};
};
