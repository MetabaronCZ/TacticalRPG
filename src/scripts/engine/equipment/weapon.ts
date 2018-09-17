import Weapons from 'data/weapons';

import { WeaponSkillID } from 'engine/skill/weapon';
import { WeaponTypeID, WeaponID } from 'engine/equipment/weapon-data';

class Weapon {
	private readonly id: WeaponID;
	private readonly title: string;
	private readonly description: string;
	private readonly type: WeaponTypeID;
	private readonly skills: WeaponSkillID[];
	private readonly damage: number;
	private readonly magic: number;

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

	public isType(type: WeaponTypeID): boolean {
		return type === this.type;
	}

	public getId(): WeaponID {
		return this.id;
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
