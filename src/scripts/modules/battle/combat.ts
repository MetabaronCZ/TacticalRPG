import { PI } from 'core/number';

import Skills from 'data/skills';
import Weapons from 'data/weapons';
import * as DMG from 'data/combat';

import Skill from 'modules/skill';
import Vector from 'modules/geometry/vector';
import Character, { ICharacter } from 'modules/character';
import { ElementAffinityTable, Affinity } from 'modules/skill/affinity';
import StatusEffect, { StatusEffectID } from 'modules/battle/status-effect';
import { SkillElement, ISkillData, SkillID } from 'modules/skill/skill-data';

import Player from 'modules/battle/player';
import { PlayerData } from 'modules/battle-configuration/player-data';

const precision = 10 ** 10; // angle precision modifier
const backAttackAngle = PI / 3; // 60 degrees

// shadow player used for preview computations
const plData = new PlayerData(-1, { name: 'PREVIEW' });
const shadowPlayer = new Player(plData, []);

interface IBlockValue {
	readonly physical: number;
	readonly magical: number;
}

interface IShieldValue {
	readonly physical: number;
	readonly magical: number;
	readonly cost: number;
}

export interface ICombatInfo {
	type: 'DAMAGE' | 'SUPPORT';
	caster: Character;
	target: Character;
	skill: Skill;
	physical: number;
	magical: number;
	damage: number;
	healing: number;
	affinity: Affinity;
	backAttack: boolean;
	blocked: IBlockValue | null;
	shielded: IShieldValue | null;
	status: StatusEffect[];
}

export interface ICasterPreview {
	readonly isSupport: boolean;
	readonly skills: Array<{
		readonly skill: Skill;
		readonly damage: number;
		readonly healing: number;
	}>;
}

export interface ITargetPreview {
	readonly physical: number;
	readonly magical: number;
	readonly elementalStrength: SkillElement;
	readonly elementalWeakness: SkillElement;
	readonly block: number | null;
	readonly shield: number | null;
}

export const isBackAttacked = (attacker: Character, defender: Character): boolean => {
	const attVector = Vector.fromTiles(attacker.position, defender.position);
	const defVector = Vector.fromDirection(defender.direction);
	const angle = attVector.getAngle(defVector);

	// get approximate value (resulting angle is bigger, even if it should be equal PI / 3)
	const approxAngle = Math.floor(precision * angle) / precision;
	return approxAngle <= backAttackAngle;
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
	const weapon = Weapons.get(skill.weapon);
	const weaponDamage = weapon.physical;
	const { STR } = character.attributes;

	if (skill.isFixedDamage) {
		return skill.physical;
	}
	return (STR + weaponDamage) * skill.physical;
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

const getStatusEffects = (caster: Character, target: Character, skill: Skill, phy = 0, mag = 0, isGuarding = false): StatusEffect[] => {
	const statuses = skill.status.map(id => new StatusEffect(id, skill));
	const { STR: attSTR, MAG: attMAG } = caster.attributes;
	const { VIT: defVIT, SPR: defSPR } = target.attributes;
	const effects: StatusEffect[] = [];

	for (const status of statuses) {
		switch (status.type) {
			case 'PHYSICAL':
				if (attSTR >= defVIT && (!isGuarding || phy > 0)) {
					effects.push(status);
				}
				break;

			case 'MAGICAL':
				if (attMAG >= defSPR && (!isGuarding || mag > 0)) {
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

export const previewCasterInfo = (char: ICharacter, skills: Skill[]): ICasterPreview | null => {
	if (!skills.length) {
		return null;
	}
	const character = Character.from(char, shadowPlayer);
	const isSupport = ('HOLY' === skills[0].element);
	return {
		isSupport,
		skills: skills.map(skill => {
			if (isSupport) {
				return {
					skill,
					damage: 0,
					healing: getMagicalDamage(character, skill)
				};
			}
			const physical = getPhysicalDamage(character, skill);
			const magical = getMagicalDamage(character, skill);
			return {
				skill,
				healing: 0,
				damage: physical + magical
			};
		})
	};
};

export const previewTargetInfo = (char: ICharacter): ITargetPreview => {
	const character = Character.from(char, shadowPlayer);

	// apply reaction skills for computations
	if ('MAGICAL' === character.armor.id) {
		const shieldSkill = new Skill('ENERGY_SHIELD');
		character.status.apply(shieldSkill, 'ENERGY_SHIELD');
	}

	if ('SHIELD' === character.offHand.type) {
		let skillID: SkillID;
		let statusID: StatusEffectID;

		if ('SHIELD_LARGE' === character.offHand.id) {
			statusID = 'BLOCK_LARGE';
			skillID = 'SHD_LARGE_BLOCK';
		} else {
			statusID = 'BLOCK_SMALL';
			skillID = 'SHD_SMALL_BLOCK';
		}
		const blockSkill = new Skill(skillID);
		character.status.apply(blockSkill, statusID);
	}
	const { skillset, armor } = character;
	const block = getBlock(character);
	const shield = getShield(character);

	// elemental affinity
	const elementalWeakness = ElementAffinityTable[skillset.element] || 'NONE';

	const elmStrengths = Object.entries(ElementAffinityTable)
		.filter(elm => elm[1] === skillset.element)
		.map(elm => elm[0] as SkillElement);

	const elementalStrength = (elmStrengths.length ? elmStrengths[0] : null) || 'NONE';

	return {
		block,
		shield,
		elementalWeakness,
		elementalStrength,
		physical: 1 - armor.physical,
		magical: 1 - armor.magical
	};
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
		damage: 0,
		healing: 0,
		affinity: 'ELEMENTAL_NEUTRAL',
		backAttack: false,
		blocked: null,
		shielded: null,
		status: getStatusEffects(caster, target, skill)
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

	// resolve status application
	const isGuarding = !!(shielded || blocked);
	const status = getStatusEffects(caster, target, skill, physical, magical, isGuarding);

	// update result
	result.damage = physical + magical;
	result.physical = physical;
	result.magical = magical;
	result.affinity = affinity;
	result.backAttack = backAttack;
	result.blocked = blocked;
	result.shielded = shielded;
	result.status = status;

	return result;
};
