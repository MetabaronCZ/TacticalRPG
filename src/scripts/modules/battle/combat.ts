import Skills from 'data/skills';
import Weapons from 'data/weapons';
import * as DMG from 'data/combat';

import Skill from 'modules/skill';
import Vector from 'modules/geometry/vector';
import Command from 'modules/battle/command';
import { ISkillData } from 'modules/skill/skill-data';
import { WeaponID } from 'modules/equipment/weapon-data';
import Character, { ICharacterSnapshot } from 'modules/character';
import StatusEffect, { StatusEffectID } from 'modules/battle/status-effect';
import { AffinityTable, Affinity, ElementID } from 'modules/skill/affinity';

interface IBlockValue {
	readonly physical: number;
	readonly magical: number;
}

interface IShieldValue {
	readonly physical: number;
	readonly magical: number;
	readonly cost: number;
}

interface IStatusValue {
	attack: number;
	defense: number;
}

export interface ICombatInfo {
	caster: Character;
	target: Character;
	skill: Skill;
	physical: number;
	magical: number;
	damage: number;
	healing: number;
	blocked: IBlockValue | null;
	shielded: IShieldValue | null;
	status: StatusEffect[];
}

export interface ICasterPreviewPhysical {
	readonly weapon: WeaponID;
	readonly value: number;
}

export interface ICasterPreviewMagical {
	readonly element: ElementID ;
	readonly value: number;
}

export interface ICasterPreviewHealing {
	readonly value: number;
}

export interface ICasterCombatPreview {
	readonly character: ICharacterSnapshot;
	readonly status: StatusEffectID[];
	readonly statusModifier: number;
	readonly physicalSkills: ICasterPreviewPhysical[];
	readonly magicalSkills: ICasterPreviewMagical[];
	readonly healingSkills: ICasterPreviewHealing[];
	directionModifier: number;
	affinity: number;
}

export interface ITargetCombatPreview {
	readonly character: ICharacterSnapshot;
	readonly statusModifier: number;
	elementalStrength: ElementID | null;
	elementalWeakness: ElementID | null;
	block: number | null;
	shield: number | null;
}

export interface ICombatPreview {
	readonly caster: ICasterCombatPreview;
	target: ITargetCombatPreview | null;
}

const getCharacterAngle = (attacker: Character, defender: Character): number => {
	const attVector = Vector.fromTiles(attacker.position, defender.position);
	const defVector = Vector.fromDirection(defender.direction);
	const angle = attVector.getAngle(defVector);

	// get approximate value (resulting angle is bigger, even if it should be equal PI / 3)
	const approxAngle = Math.floor(DMG.anglePrecision * angle) / DMG.anglePrecision;
	return approxAngle;
};

export const isBackAttacked = (attacker: Character, defender: Character): boolean => {
	const angle = getCharacterAngle(attacker, defender);
	return angle <= DMG.sideBackAttackAngle;
};

const getAffinity = (attacker: ElementID, defender: ElementID): Affinity => {
	if (AffinityTable[attacker] === defender) {
		return 'ELEMENTAL_STRONG';
	}
	if (defender === attacker) {
		return 'ELEMENTAL_WEAK';
	}
	return 'ELEMENTAL_NEUTRAL';
};

const getAffinityModifier = (affinity: Affinity): number => {
	return DMG.affinityModifierTable[affinity];
};

const getDirectionalModifier = (attacker: Character, defender: Character): number => {
	const angle = getCharacterAngle(attacker, defender);

	if (angle <= DMG.backAttackAngle) {
		return DMG.backAttackModifier;
	}
	if (angle <= DMG.sideBackAttackAngle) {
		return DMG.sideBackAttackModifier;
	}
	return 1;
};

const getBlock = (character: Character, isPreview = false): number | null => {
	const hasShield = ('SHIELD' === character.offHand.type);

	if (hasShield) {
		const shield = character.offHand;
		let skill: ISkillData | null = null;

		let hasSmallShield = character.status.has('BLOCK_SMALL');
		let hasLargeShield = character.status.has('BLOCK_LARGE');

		if (isPreview) {
			hasSmallShield = ('SHIELD_SMALL' === shield.id);
			hasLargeShield = ('SHIELD_LARGE' === shield.id);
		}

		if (hasSmallShield) {
			skill = Skills.get('SHD_SMALL_BLOCK');
		}

		if (hasLargeShield) {
			skill = Skills.get('SHD_LARGE_BLOCK');
		}

		if (skill) {
			const mod = skill.block ? skill.block.modifier : 1;
			return (shield.block || 0) * mod;
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

const getShield = (character: Character, isPreview = false): number | null => {
	let hasAethershield = character.status.has('AETHERSHIELD');

	if (isPreview) {
		hasAethershield = true;
	}

	if (!hasAethershield) {
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
	if (!skill.physical || 0 === skill.physical.modifier) {
		return 0;
	}
	const weapon = Weapons.get(skill.physical.weapon);
	const isFixedDamage = ('GUN' === weapon.id);
	const mod = skill.physical.modifier;

	if (isFixedDamage) {
		return mod;
	}
	const weaponDamage = weapon.physical;
	const { STR } = character.attributes;

	return (STR + weaponDamage) * mod;
};

const getMagicalDamage = (character: Character, modifier = 0): number => {
	if (0 === modifier) {
		return 0;
	}
	const { mainHand, offHand } = character;
	const weaponDamage = mainHand.magical + offHand.magical;
	const { MAG } = character.attributes;

	return (MAG + weaponDamage) * modifier;
};

const getStatusModifier = (attacker: Character, defender?: Character | null): IStatusValue => {
	let attack = 1;
	let defense = 1;

	if (attacker.status.has('BERSERK')) {
		attack *= DMG.berserkAttackModifier;
	}

	if (defender) {
		if (defender.status.has('SHOCK')) {
			defense *= DMG.shockModifier;
		}
		if (defender.status.has('BERSERK')) {
			defense *= DMG.berserkDefenseModifier;
		}
	}
	return { attack, defense };
};

const getStatusEffects = (caster: Character, target: Character, skill: Skill, phy = 0, mag = 0, isGuarding = false): StatusEffect[] => {
	const statuses = skill.status.map(id => new StatusEffect(id));
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

export const getCombatPreview = (command: Command, caster: Character, target: Character | null): ICombatPreview | null => {
	const { skills } = command;

	if (!skills.length) {
		return null;
	}
	const allied = (!!target && caster.player === target.player);
	const statusMod = getStatusModifier(caster, target);

	const preview: ICombatPreview = {
		caster: {
			character: caster.serialize(),
			statusModifier: statusMod.attack,
			directionModifier: 1,
			affinity: 1,
			physicalSkills: [],
			magicalSkills: [],
			healingSkills: [],
			status: []
		},
		target: null
	};

	// back attack check
	if (target && !command.isSupport && !allied) {
		preview.caster.directionModifier = getDirectionalModifier(caster, target);
	}

	// get caster command skills info
	for (const skill of skills) {
		if (skill.healing) {
			// add healing data
			preview.caster.healingSkills.push({
				value: getMagicalDamage(caster, skill.healing.modifier)
			});

			continue;
		}

		// add damage data
		if (skill.physical) {
			preview.caster.physicalSkills.push({
				weapon: skill.physical.weapon,
				value: getPhysicalDamage(caster, skill)
			});
		}

		if (skill.magical) {
			preview.caster.magicalSkills.push({
				element: skill.magical.element,
				value: getMagicalDamage(caster, skill.magical.modifier)
			});
		}

		for (const effect of skill.status) {
			preview.caster.status.push(effect);
		}

		// add element affinity data
		if (target) {
			const casterElm = caster.skillset.element;
			const targetElm = target.skillset.element;
			let affinity: Affinity = 'ELEMENTAL_NEUTRAL';

			if (casterElm && targetElm) {
				affinity = getAffinity(casterElm, targetElm);
			}
			preview.caster.affinity = getAffinityModifier(affinity);
		}
	}

	// handle target stats
	if (target) {
		const { skillset } = target;
		const targetElm = skillset.element;

		preview.target = {
			character: target.serialize(),
			statusModifier: statusMod.defense,
			block: getBlock(target, true) || 0,
			shield: getShield(target, true) || 0,
			elementalStrength: null,
			elementalWeakness: null
		};

		if (targetElm) {
			for (const id of Object.keys(AffinityTable)) {
				const elm = id as ElementID;
				const affinity = getAffinity(elm, targetElm);

				if ('ELEMENTAL_STRONG' === affinity) {
					preview.target.elementalWeakness = elm;
				}

				if ('ELEMENTAL_WEAK' === affinity) {
					preview.target.elementalStrength = elm;
				}
			}
		}
	}

	return preview;
};

export const getCombatInfo = (caster: Character, target: Character, skill: Skill): ICombatInfo => {
	const result: ICombatInfo = {
		caster,
		target,
		skill,
		physical: 0,
		magical: 0,
		damage: 0,
		healing: 0,
		blocked: null,
		shielded: null,
		status: getStatusEffects(caster, target, skill)
	};

	if (skill.healing) {
		result.healing = getMagicalDamage(caster, skill.healing.modifier);
		return result;
	}

	// handle damaging skill
	let physical = getPhysicalDamage(caster, skill);
	let magical = 0;

	let affinity: Affinity = 'ELEMENTAL_NEUTRAL';

	if (skill.magical) {
		magical = getMagicalDamage(caster, skill.magical.modifier);

		if (target.skillset.element) {
			affinity = getAffinity(skill.magical.element, target.skillset.element);
		}
	}
	const affinityMod = getAffinityModifier(affinity);

	// directional modifier
	const directionMod = getDirectionalModifier(caster, target);

	// shield block
	const block = getBlock(target);
	const blocked = getBlockValue(physical, magical, block);

	if (blocked) {
		physical -= blocked.physical;
		magical -= blocked.magical;
	}

	// aethershield
	const shield = getShield(target);
	const shielded = getShieldValue(physical, magical, shield);

	if (shielded) {
		physical -= shielded.physical;
		magical -= shielded.magical;
	}

	// status modifiers
	const statusModifier = getStatusModifier(caster, target);
	const statusMod = statusModifier.attack * statusModifier.defense;

	if (physical > 0) {
		physical *= directionMod * statusMod;
	}

	if (magical > 0) {
		magical *= directionMod * statusMod * affinityMod;
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
	result.blocked = blocked;
	result.shielded = shielded;
	result.status = status;

	return result;
};
