import DataList from 'models/data-list';
import { IWeaponData } from 'models/weapon';
import { WeaponSKillID } from 'models/skill/weapon/id';
import { ISKill, SKillType, SkillUsage } from 'models/skill';

import smallSkills from 'models/skill/weapon/small';
import wield1HSkills from 'models/skill/weapon/wield1h';
import wield2HSkills from 'models/skill/weapon/wield2h';
import magicalSkills from 'models/skill/weapon/magical';
import rangedSkills from 'models/skill/weapon/ranged';
import shieldSkills from 'models/skill/weapon/shield';

class WeaponSkillList extends DataList<WeaponSKillID, ISKill> {
	public filterAttack(main: IWeaponData, off: IWeaponData): WeaponSKillID[] {
		const skills: WeaponSKillID[] = [];

		for (const id of [...main.skills, ...off.skills]) {
			const skill = this.get(id);

			if (SKillType.ACTIVE === skill.type && SkillUsage.ATTACK === skill.usage) {
				skills.push(id);
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

				if (SKillType.ACTIVE === skill.type && SkillUsage.SPECIAL === skill.usage && -1 === uniqueSkills.indexOf(id)) {
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
