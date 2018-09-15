import StatusEffects from 'data/status-effects';
import { smallShieldBlock } from 'data/game-config';

import Skill from 'modules/skill';
import Armors from 'modules/armor';
import Weapons from 'modules/weapon';
import Skillsets from 'modules/skillset';
import { SkillID } from 'modules/skill/types';
import { WeaponTypeID } from 'modules/weapon/types';
import { ICharacter } from 'modules/character/types';
import { WeaponSkillID } from 'modules/skill/weapon/types';

import { StatusEffectID } from 'engine/status-effect';

const getPhysical = (attacker: ICharacter, defender: ICharacter, skillId: SkillID): number => {
	const skill = Skill.getByID([skillId])[0];
	const defArmor = Armors.get(defender.data.armor);
	const attWeapon = Weapons.values().find(wpn => -1 !== wpn.skills.indexOf(skillId as WeaponSkillID));
	const defOffHand = Weapons.get(defender.data.off);
	const defArmorDefense = defArmor.physicalDefense;
	const attWeaponDamage = (attWeapon ? attWeapon.damage : 1);

	const defense = (1 - defender.currAttributes.VIT / 100) * (1 - defArmorDefense / 100);
	let attack = 0;

	if (skill.isFixedPhysicalDamage) {
		attack = skill.physicalDamage;
	} else {
		attack = attacker.currAttributes.STR * attWeaponDamage * skill.physicalDamage;
	}
	const defHasShield = (WeaponTypeID.SHIELD === defOffHand.type);
	const defHasBlocked = (-1 !== defender.status.map(status => status.id).indexOf('BLOCK_SMALL'));
	let defBlock = 0;

	// small shield block
	if (defHasShield && defHasBlocked) {
		defBlock = smallShieldBlock;
	}
	const damage = Math.round(attack * defense * (1 - defBlock));

	return damage > 0 ? damage : 0;
};

const getElemental = (attacker: ICharacter, defender: ICharacter, skillId: SkillID): number => {
	const skill = Skill.getByID([skillId])[0];
	const main = Weapons.get(attacker.data.main);
	const off = Weapons.get(attacker.data.off);
	const armor = Armors.get(defender.data.armor);
	const armorDefense = armor.magicalDefense;
	const magBonus = main.magic + off.magic;
	const skillset = Skillsets.get(defender.data.skillset);
	const modifier = Skill.getElementModifier(skill.element, skillset.element);

	const attack = (attacker.currAttributes.MAG + magBonus) * skill.elementalDamage;
	const defense = (1 - defender.currAttributes.SPR / 100) * (1 - armorDefense / 100);
	const damage = Math.round(attack * defense * modifier);

	return damage > 0 ? damage : 0;
};

const getStatusEffects = (attacker: ICharacter, defender: ICharacter, skillId: SkillID): StatusEffectID[] => {
	const skill = Skill.getByID([skillId])[0];
	const statuses = skill.status.map(id => StatusEffects.get(id)());
	const effects: StatusEffectID[] = [];

	for (const status of statuses) {
		switch (status.type) {
			case 'PHYSICAL':
				if (attacker.currAttributes.STR >= defender.currAttributes.VIT) {
					effects.push(status.id);
				}
				break;

			case 'MAGICAL':
				if (attacker.currAttributes.MAG >= defender.currAttributes.SPR) {
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

const Damage = {
	getPhysical,
	getElemental,
	getStatusEffects
};

export default Damage;
