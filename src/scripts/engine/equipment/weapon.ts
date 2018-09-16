import { WeaponSkillID } from 'engine/skill/weapon/types';
import { IWeaponData, WeaponTypeID } from 'engine/equipment/weapon-data';

class Weapon {
	private readonly title: string;
	private readonly description: string;
	private readonly type: WeaponTypeID;
	private readonly skills: WeaponSkillID[];
	private readonly damage: number;
	private readonly magic: number;

	constructor(data: IWeaponData) {
		this.title = data.title;
		this.description = data.description;
		this.type = data.type;
		this.skills = data.skills;
		this.damage = data.damage;
		this.magic = data.magic;
	}

	public getTitle(): string {
		return this.title;
	}

	public getDescription(): string {
		return this.description;
	}

	public getType(): WeaponTypeID {
		return this.type;
	}

	public getSkills(): WeaponSkillID[] {
		return this.skills;
	}

	public getDamage(): number {
		return this.damage;
	}

	public getMagic(): number {
		return this.magic;
	}
}

export default Weapon;
