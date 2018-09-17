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
		const defArmor = defender.getEquipment().getArmor();
		const attWeapon = Weapons.values().find(wpn => -1 !== (wpn.skills as SkillID[]).indexOf(skill.getId()));
		const defOffHand = defender.getEquipment().getOffHand();
		const defArmorDefense = defArmor.getPhysicalDefense();
		const attWeaponDamage = (attWeapon ? attWeapon.damage : 1);

		const defense = (1 - defender.getAttribute('VIT') / 100) * (1 - defArmorDefense / 100);
		let attack = 0;

		if (skill.isFixedPhysicalDamage) {
			attack = skill.getPhysicalDamage();
		} else {
			attack = attacker.getAttribute('STR') * attWeaponDamage * skill.getPhysicalDamage();
		}
		const defHasShield = ('SHIELD' === defOffHand.getType());
		const defHasBlocked = defender.hasStatus('BLOCK_SMALL');
		let defBlock = 0;

		// small shield block
		if (defHasShield && defHasBlocked) {
			defBlock = smallShieldBlock;
		}
		const damage = Math.round(attack * defense * (1 - defBlock));

		return damage > 0 ? damage : 0;
	}

	public static getElemental(attacker: Character, defender: Character, skill: Skill): number {
		const main = attacker.getEquipment().getMainHand();
		const off = attacker.getEquipment().getOffHand();
		const armor = defender.getEquipment().getArmor();
		const armorDefense = armor.getMagicalDefense();
		const magBonus = main.getMagic() + off.getMagic();
		const skillset = defender.getSkillset();
		const modifier = SkillUtils.getElementModifier(skill.getElement(), skillset.getElement());

		const attack = (attacker.getAttribute('MAG') + magBonus) * skill.getElementalDamage();
		const defense = (1 - defender.getAttribute('SPR') / 100) * (1 - armorDefense / 100);
		const damage = Math.round(attack * defense * modifier);

		return damage > 0 ? damage : 0;
	}

	public static getStatusEffects(attacker: Character, defender: Character, skill: Skill): StatusEffectID[] {
		const statuses = skill.getStatus().map(id => StatusEffects.get(id)());
		const attackSTR = attacker.getAttribute('STR');
		const attackMAG = attacker.getAttribute('MAG');
		const defendVIT = defender.getAttribute('VIT');
		const defendSPR = defender.getAttribute('SPR');
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
