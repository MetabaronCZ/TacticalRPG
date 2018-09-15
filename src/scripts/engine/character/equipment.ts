import Armors from 'data/armors';

import { ICharacterData } from 'modules/character-data/types';
import Weapons from 'modules/weapon';

import Armor from 'engine/armor';
import Weapon from 'engine/weapon';

class Equipment {
	private readonly mainHand: Weapon;
	private readonly offHand: Weapon;
	private readonly armor: Armor;

	constructor(data: ICharacterData) {
		this.mainHand = new Weapon(Weapons.get(data.main));
		this.offHand = new Weapon(Weapons.get(data.off));
		this.armor = new Armor(Armors.get(data.armor));
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
