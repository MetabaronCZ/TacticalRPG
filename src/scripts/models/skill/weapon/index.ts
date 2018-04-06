import DataList from 'models/data-list';
import { IWeaponData } from 'models/weapon';
import { ISKill, SKillType } from 'models/skill';
import { WeaponSKillID } from 'models/skill/weapon/id';

import smallSkills from 'models/skill/weapon/small';
import wield1HSkills from 'models/skill/weapon/wield1h';
import wield2HSkills from 'models/skill/weapon/wield2h';
import magicalSkills from 'models/skill/weapon/magical';
import rangedSkills from 'models/skill/weapon/ranged';
import shieldSkills from 'models/skill/weapon/shield';

const attackSkills = [
	WeaponSKillID.FISTS_ATTACK,
	WeaponSKillID.DAGGER_ATTACK,
	WeaponSKillID.SWORD_1H_ATTACK,
	WeaponSKillID.AXE_1H_ATTACK,
	WeaponSKillID.HAMMER_1H_ATTACK,
	WeaponSKillID.SPEAR_ATTACK,
	WeaponSKillID.SWORD_2H_ATTACK,
	WeaponSKillID.AXE_2H_ATTACK,
	WeaponSKillID.HAMMER_2H_ATTACK,
	WeaponSKillID.MACE_ATTACK,
	WeaponSKillID.STAFF_ATTACK,
	WeaponSKillID.BOW_ATTACK,
	WeaponSKillID.GUN_1H_ATTACK,
	WeaponSKillID.GUN_2H_ATTACK
];

const isAttackSkill = (id: WeaponSKillID): boolean => -1 !== attackSkills.indexOf(id);

class WeaponSkillList extends DataList<WeaponSKillID, ISKill> {
	public filterAttack(main: IWeaponData, off: IWeaponData): Array<[WeaponSKillID, IWeaponData]> {
		const skills: Array<[WeaponSKillID, IWeaponData]> = [];

		for (const wpn of [main, off]) {
			for (const id of wpn.skills) {
				const skill = this.get(id);

				if (SKillType.ACTIVE === skill.type && isAttackSkill(id)) {
					skills.push([id, wpn]);
				}
			}
		}
		return skills;
	}

	public filterSpecial(main: IWeaponData, off: IWeaponData): Array<[WeaponSKillID, IWeaponData]> {
		const skills: Array<[WeaponSKillID, IWeaponData]> = [];
		const uniqueSkills: WeaponSKillID[] = [];

		for (const wpn of [main, off]) {
			for (const id of wpn.skills) {
				const skill = this.get(id);

				if (SKillType.ACTIVE === skill.type && !isAttackSkill(id) && -1 === uniqueSkills.indexOf(id)) {
					uniqueSkills.push(id);
					skills.push([id, wpn]);
				}
			}
		}
		return skills;
	}
}

export const WeaponSKills = new WeaponSkillList([
	...smallSkills,
	...wield1HSkills,
	...wield2HSkills,
	...magicalSkills,
	...rangedSkills,
	...shieldSkills
]);
