import { PI } from 'core/number';

import Skills from 'data/skills';
import Weapons from 'data/weapons';
import * as DMG from 'data/combat';

import Skill from 'modules/skill';
import Vector from 'modules/geometry/vector';
import Command from 'modules/battle/command';
import Character, { ICharacterSnapshot } from 'modules/character';
import { SkillElement, ISkillData } from 'modules/skill/skill-data';
import { ElementAffinityTable, Affinity } from 'modules/skill/affinity';
import StatusEffect, { StatusEffectID } from 'modules/battle/status-effect';

const precision = 10 ** 10; // angle precision modifier
const backAttackAngle = PI / 3; // 60 degrees

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

export interface ICasterPreviewItem {
	readonly skill: Skill;
	readonly value: number;
}

export interface ICasterCombatPreview {
	readonly character: ICharacterSnapshot;
	readonly status: StatusEffectID[];
	readonly statusModifier: number;
	readonly physicalSkills: ICasterPreviewItem[];
	readonly magicalSkills: ICasterPreviewItem[];
	readonly healingSkills: ICasterPreviewItem[];
	directionModifier: number;
	affinity: number;
}

export interface ITargetCombatPreview {
	readonly character: ICharacterSnapshot;
	readonly statusModifier: number;
	physical: number;
	magical: number;
	elementalStrength: SkillElement;
	elementalWeakness: SkillElement;
	block: number | null;
	shield: number | null;
}

export interface ICombatPreview {
	readonly caster: ICasterCombatPreview;
	target: ITargetCombatPreview | null;
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
	if (defender === attacker) {
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

const getShield = (character: Character, isPreview = false): number | null => {
	let hasEnergyShield = character.status.has('ENERGY_SHIELD');

	if (isPreview) {
		hasEnergyShield = true;
	}

	if (!hasEnergyShield) {
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
		if (defender.status.has('IRON_SKIN')) {
			defense *= DMG.ironSkinModifier;
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

	// check back attack
	if (target && !command.isSupport && !allied) {
		const backAttacked = isBackAttacked(caster, target);
		preview.caster.directionModifier = getDirectionalModifier(backAttacked);
	}

	// get caster command skills info
	for (const skill of skills) {
		const physical = getPhysicalDamage(caster, skill);
		const magical = getMagicalDamage(caster, skill);

		for (const effect of skill.status) {
			preview.caster.status.push(effect);
		}

		if (skill.isSupport) {
			// add healing data
			preview.caster.healingSkills.push({
				skill,
				value: magical
			});

		} else {
			// add damage data
			if ('NONE' !== skill.weapon) {
				preview.caster.physicalSkills.push({
					skill,
					value: physical
				});
			}

			if ('NONE' !== skill.element) {
				preview.caster.magicalSkills.push({
					skill,
					value: magical
				});
			}

			// add element affinity data
			if (target) {
				const affinity = getAffinity(caster.skillset.element, target.skillset.element);
				preview.caster.affinity = getAffinityModifier(affinity);
			}
		}
	}

	// handle target stats
	if (target) {
		const { skillset, armor } = target;
		const targetElm = skillset.element;

		preview.target = {
			character: target.serialize(),
			statusModifier: statusMod.defense,
			block: getBlock(target, true) || 0,
			shield: getShield(target, true) || 0,
			magical: 1 - armor.magical,
			physical: 1 - armor.physical,
			elementalStrength: 'NONE',
			elementalWeakness: 'NONE'
		};

		for (const id of Object.keys(ElementAffinityTable)) {
			const elm = id as SkillElement;
			const affinity = getAffinity(elm, targetElm);

			if ('ELEMENTAL_STRONG' === affinity) {
				preview.target.elementalWeakness = elm;
			}

			if ('ELEMENTAL_WEAK' === affinity) {
				preview.target.elementalStrength = elm;
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

	if (skill.isSupport) {
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
	const statusMod = statusModifier.attack * statusModifier.defense;

	if (physical > 0) {
		physical *= directionMod * statusMod * target.armor.physical;
	}

	if (magical > 0) {
		magical *= directionMod * statusMod * affinityMod * target.armor.magical;
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
