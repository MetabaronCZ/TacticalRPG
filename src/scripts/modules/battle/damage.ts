import Weapons from 'data/weapons';
import StatusEffects from 'data/status-effects';
import { smallShieldBlock } from 'data/game-config';

import Skill from 'modules/skill';
import Character from 'modules/character';
import { StatusEffectID } from 'modules/battle/status-effect';
import { ElementAffinityTable } from 'modules/skill/affinity';
import { SkillID, SkillElement } from 'modules/skill/skill-data';

const getElementModifier = (attacker: SkillElement, defender: SkillElement): number => {
	if (ElementAffinityTable[attacker] === defender) {
		return 2;
	}
	if (ElementAffinityTable[defender] === attacker) {
		return 0.5;
	}
	return 1;
};

export const getPhysicalDamage = (attacker: Character, defender: Character, skill: Skill): number => {
	const defArmor = defender.armor;
	const attWeapon = Weapons.values().find(wpn => -1 !== (wpn.skills as SkillID[]).indexOf(skill.id));
	const defOffHand = defender.offHand;
	const defArmorDefense = defArmor.physicalDefense;
	const attWeaponDamage = (attWeapon ? attWeapon.damage : 1);

	const defense = (1 - defender.attributes.VIT / 100) * (1 - defArmorDefense / 100);
	let attack = 0;

	if (skill.isFixedPhysicalDamage) {
		attack = skill.physicalDamage;
	} else {
		attack = attacker.attributes.STR * attWeaponDamage * skill.physicalDamage;
	}
	const defHasShield = ('SHIELD' === defOffHand.type);
	const defHasBlocked = defender.status.has('BLOCK_SMALL');
	let defBlock = 0;

	// small shield block
	if (defHasShield && defHasBlocked) {
		defBlock = smallShieldBlock;
	}
	const damage = Math.round(attack * defense * (1 - defBlock));

	return damage > 0 ? damage : 0;
};

export const getElementalDamage = (attacker: Character, defender: Character, skill: Skill): number => {
	const main = attacker.mainHand;
	const off = attacker.offHand;
	const armor = defender.armor;
	const armorDefense = armor.magicalDefense;
	const magBonus = main.magic + off.magic;
	const skillset = defender.skillset;
	const modifier = getElementModifier(skill.element, skillset.element);

	const attack = (attacker.attributes.MAG + magBonus) * skill.elementalDamage;
	const defense = (1 - defender.attributes.SPR / 100) * (1 - armorDefense / 100);
	const damage = Math.round(attack * defense * modifier);

	return damage > 0 ? damage : 0;
};

export const getStatusEffects = (attacker: Character, defender: Character, skill: Skill): StatusEffectID[] => {
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
