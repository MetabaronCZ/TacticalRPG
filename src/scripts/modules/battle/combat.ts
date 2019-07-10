import Skills from 'data/skills';
import Weapons from 'data/weapons';
import * as DMG from 'data/combat';

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

export interface ICombatInfo {
	type: 'DAMAGE' | 'SUPPORT';
	caster: Character;
	target: Character;
	skill: Skill;
	physical: number;
	magical: number;
	healing: number;
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

const getBlock = (character: Character): number | null => {
	const hasShield = ('SHIELD' === character.offHand.type);

	if (hasShield) {
		const shield = character.offHand;
		let skill: ISkillData | null = null;

		if (character.status.has('BLOCK_SMALL')) {
			skill = Skills.get('SHD_SMALL_BLOCK');
		}

		if (character.status.has('BLOCK_LARGE')) {
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

const getShield = (character: Character): number | null => {
	if (!character.status.has('ENERGY_SHIELD')) {
		return null;
	}
	return character.attributes.MP;
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

const getPhysicalDamage = (character: Character, skill: Skill): number => {
	if (0 === skill.physical) {
		return 0;
	}
	const weapon = Weapons.values().find(wpn => -1 !== (wpn.skills as SkillID[]).indexOf(skill.id));
	const weaponDamage = (weapon ? weapon.physical : 0);

	if (skill.isFixedDamage) {
		return skill.physical;
	} else {
		return (character.attributes.STR + weaponDamage) * skill.physical;
	}
};

const getMagicalDamage = (character: Character, skill: Skill): number => {
	if (0 === skill.magical) {
		return 0;
	}
	const { mainHand, offHand } = character;
	const weaponDamage = mainHand.magical + offHand.magical;
	return (character.attributes.MAG + weaponDamage) * skill.magical;
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

const getStatusEffects = (caster: Character, target: Character, skill: Skill, isSupport: boolean): StatusEffect[] => {
	const statuses = skill.status.map(id => new StatusEffect(id, caster));

	if (isSupport) {
		return statuses;
	}
	const { STR: attSTR, MAG: attMAG } = caster.attributes;
	const { VIT: defVIT, SPR: defSPR } = target.attributes;
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

export const getCombatInfo = (caster: Character, target: Character, skill: Skill): ICombatInfo => {
	const isSupport = (caster.player === target.player);

	const result: ICombatInfo = {
		type: 'DAMAGE',
		caster,
		target,
		skill,
		physical: 0,
		magical: 0,
		healing: 0,
		affinity: 'ELEMENTAL_NEUTRAL',
		backAttack: false,
		blocked: null,
		shielded: null,
		status: getStatusEffects(caster, target, skill, isSupport)
	};
	if (isSupport) {
		result.type = 'SUPPORT';
		result.healing = getMagicalDamage(caster, skill);
		return result;
	}
	// handle damaging skill
	let physical = getPhysicalDamage(caster, skill);
	let magical = getMagicalDamage(caster, skill);

	// elemental affnity
	const affinity = getAffinity(skill.element, target.skillset.element);
	const affinityMod = getAffinityModifier(affinity);

	// directional modifier
	const backAttack = isBackAttacked(caster, target);
	const directionMod = getDirectionalModifier(backAttack);

	// shield block
	const block = getBlock(target);
	const blocked = getBlockValue(physical, magical, block);

	if (blocked) {
		physical -= blocked.physical;
		magical -= blocked.magical;
	}

	// energy shield
	const shield = getShield(target);
	const shielded = getShieldValue(physical, magical, shield);

	if (shielded) {
		physical -= shielded.physical;
		magical -= shielded.magical;
	}

	// status modifiers
	const statusModifier = getStatusModifier(caster, target);

	if (physical > 0) {
		physical *= directionMod * statusModifier * target.armor.physical;
	}

	if (magical > 0) {
		magical *= directionMod * statusModifier * affinityMod * target.armor.magical;
	}

	// clamp values
	physical = physical > 0 ? Math.round(physical) : 0;
	magical = magical > 0 ? Math.round(magical) : 0;

	// update result
	result.physical = physical;
	result.magical = magical;
	result.affinity = affinity;
	result.backAttack = backAttack;
	result.blocked = blocked;
	result.shielded = shielded;

	return result;
};