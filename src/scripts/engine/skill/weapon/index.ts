import DataList from 'core/data-list';

import smallSkills from 'engine/skill/weapon/small';
import wield1HSkills from 'engine/skill/weapon/wield1h';
import wield2HSkills from 'engine/skill/weapon/wield2h';
import magicalSkills from 'engine/skill/weapon/magical';
import rangedSkills from 'engine/skill/weapon/ranged';
import shieldSkills from 'engine/skill/weapon/shield';

import { ISkillData } from 'engine/skill';
import { WeaponSkillID, attackSkills } from 'engine/skill/weapon/types';

import { IWeaponData } from 'modules/weapon/types';

const isAttackSkill = (id: WeaponSkillID): boolean => -1 !== attackSkills.indexOf(id);

class WeaponSkillList extends DataList<WeaponSkillID, ISkillData> {
	public filterAttack(main: IWeaponData, off: IWeaponData): Array<[WeaponSkillID, IWeaponData]> {
		const skills: Array<[WeaponSkillID, IWeaponData]> = [];

		for (const wpn of [main, off]) {
			for (const id of wpn.skills) {
				const skill = this.get(id);

				if ('ACTIVE' === skill.type && isAttackSkill(id)) {
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

				if ('ACTIVE' === skill.type && !isAttackSkill(id) && -1 === uniqueSkills.indexOf(id)) {
					uniqueSkills.push(id);
					skills.push([id, wpn]);
				}
			}
		}
		return skills;
	}
}

const WeaponSkills = new WeaponSkillList({
	...smallSkills,
	...wield1HSkills,
	...wield2HSkills,
	...magicalSkills,
	...rangedSkills,
	...shieldSkills
});

export default WeaponSkills;
