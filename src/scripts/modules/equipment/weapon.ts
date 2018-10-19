import Weapons from 'data/weapons';

import { WeaponSkillID } from 'modules/skill/weapon';
import { WeaponTypeID, WeaponID } from 'modules/equipment/weapon-data';

class Weapon {
	public readonly id: WeaponID;
	public readonly title: string;
	public readonly description: string;
	public readonly type: WeaponTypeID;
	public readonly skills: WeaponSkillID[];
	public readonly damage: number;
	public readonly magic: number;

	constructor(id: WeaponID) {
		const data = Weapons.get(id);
		this.id = id;
		this.title = data.title;
		this.description = data.description;
		this.type = data.type;
		this.skills = data.skills;
		this.damage = data.damage;
		this.magic = data.magic;
	}
}

export default Weapon;
