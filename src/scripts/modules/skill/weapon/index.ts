import DataList from 'core/data-list';

import { ISkill } from 'modules/skill';
import { IWeaponData } from 'modules/weapon';
import { SkillType } from 'modules/skill/attributes';
import smallSkills from 'modules/skill/weapon/small';
import wield1HSkills from 'modules/skill/weapon/wield1h';
import wield2HSkills from 'modules/skill/weapon/wield2h';
import magicalSkills from 'modules/skill/weapon/magical';
import rangedSkills from 'modules/skill/weapon/ranged';
import shieldSkills from 'modules/skill/weapon/shield';
import { WeaponSkillID, attackSkills } from 'modules/skill/weapon/types';

const isAttackSkill = (id: WeaponSkillID): boolean => -1 !== attackSkills.indexOf(id);

class WeaponSkillList extends DataList<WeaponSkillID, ISkill> {
	public filterAttack(main: IWeaponData, off: IWeaponData): Array<[WeaponSkillID, IWeaponData]> {
		const skills: Array<[WeaponSkillID, IWeaponData]> = [];

		for (const wpn of [main, off]) {
			for (const id of wpn.skills) {
				const skill = this.get(id);

				if (SkillType.ACTIVE === skill.type && isAttackSkill(id)) {
					skills.push([id, wpn]);
				}
			}
		}
		return skills;
	}

	public filterSpecial(main: IWeaponData, off: IWeaponData): Array<[WeaponSkillID, IWeaponData]> {
		const skills: Array<[WeaponSkillID, IWeaponData]> = [];
		const uniqueSkills: WeaponSkillID[] = [];

		for (const wpn of [main, off]) {
			for (const id of wpn.skills) {
				const skill = this.get(id);

				if (SkillType.ACTIVE === skill.type && !isAttackSkill(id) && -1 === uniqueSkills.indexOf(id)) {
					uniqueSkills.push(id);
					skills.push([id, wpn]);
				}
			}
		}
		return skills;
	}
}

export const WeaponSkills = new WeaponSkillList({
	...smallSkills,
	...wield1HSkills,
	...wield2HSkills,
	...magicalSkills,
	...rangedSkills,
	...shieldSkills
});
