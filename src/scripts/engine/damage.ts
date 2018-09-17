import Weapons from 'data/weapons';
import StatusEffects from 'data/status-effects';
import { smallShieldBlock } from 'data/game-config';

import Skill from 'engine/skill';
import Character from 'engine/character';
import SkillUtils from 'engine/skill/utils';
import { SkillID } from 'engine/skill/skill-data';
import { StatusEffectID } from 'engine/status-effect';

class Damage {
	public static getPhysical(attacker: Character, defender: Character, skill: Skill): number {
		const defArmor = defender.armor;
		const attWeapon = Weapons.values().find(wpn => -1 !== (wpn.skills as SkillID[]).indexOf(skill.id));
		const defOffHand = defender.offHand;
		const defArmorDefense = defArmor.physicalDefense;
		const attWeaponDamage = (attWeapon ? attWeapon.damage : 1);

		const defense = (1 - defender.attributes.get('VIT') / 100) * (1 - defArmorDefense / 100);
		let attack = 0;

		if (skill.isFixedPhysicalDamage) {
			attack = skill.physicalDamage;
		} else {
			attack = attacker.attributes.get('STR') * attWeaponDamage * skill.physicalDamage;
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
	}

	public static getElemental(attacker: Character, defender: Character, skill: Skill): number {
		const main = attacker.mainHand;
		const off = attacker.offHand;
		const armor = defender.armor;
		const armorDefense = armor.magicalDefense;
		const magBonus = main.magic + off.magic;
		const skillset = defender.skillset;
		const modifier = SkillUtils.getElementModifier(skill.element, skillset.element);

		const attack = (attacker.attributes.get('MAG') + magBonus) * skill.elementalDamage;
		const defense = (1 - defender.attributes.get('SPR') / 100) * (1 - armorDefense / 100);
		const damage = Math.round(attack * defense * modifier);

		return damage > 0 ? damage : 0;
	}

	public static getStatusEffects(attacker: Character, defender: Character, skill: Skill): StatusEffectID[] {
		const statuses = skill.status.map(id => StatusEffects.get(id)());
		const attackSTR = attacker.attributes.get('STR');
		const attackMAG = attacker.attributes.get('MAG');
		const defendVIT = defender.attributes.get('VIT');
		const defendSPR = defender.attributes.get('SPR');
		const effects: StatusEffectID[] = [];

		for (const status of statuses) {
			switch (status.type) {
				case 'PHYSICAL':
					if (attackSTR >= defendVIT) {
						effects.push(status.id);
					}
					break;

				case 'MAGICAL':
					if (attackMAG >= defendSPR) {
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
	}
}

export default Damage;
