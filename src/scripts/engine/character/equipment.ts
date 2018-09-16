import Armors from 'data/armors';
import Weapons from 'data/weapons';

import Armor from 'engine/equipment/armor';
import Weapon from 'engine/equipment/weapon';
import { ArmorID } from 'engine/equipment/armor-data';
import { WeaponID } from 'engine/equipment/weapon-data';

class Equipment {
	private readonly mainHand: Weapon;
	private readonly offHand: Weapon;
	private readonly armor: Armor;

	constructor(main: WeaponID, off: WeaponID, armor: ArmorID) {
		this.mainHand = new Weapon(Weapons.get(main));
		this.offHand = new Weapon(Weapons.get(off));
		this.armor = new Armor(Armors.get(armor));
	}

	public getMainHand(): Weapon {
		return this.mainHand;
	}

	public getOffHand(): Weapon {
		return this.offHand;
	}

	public getArmor(): Armor {
		return this.armor;
	}
}

export default Equipment;
