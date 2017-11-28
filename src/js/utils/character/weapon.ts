import { WieldID, IWield } from 'models/wield';
import { WeaponID, IWeapon } from 'models/weapon';
import { WeaponTypeID } from 'models/weapon-types';
import { ICharacter } from 'models/character';
import Weapons from 'data/weapon';
import { PrimaryID } from 'models/primary';
import { SecondaryID } from 'models/secondary';
import { JobID } from 'models/job';

const check = (wpn: IWeapon, char: ICharacter, slot: WieldID): boolean => {
	const primary = char.primary;
	const secondary = char.secondary;
	const wield: WieldID[] = wpn.wield;

	// check weapon type according to character archetype
	switch (wpn.type) {
		case WeaponTypeID.NONE:
			return true;

		case WeaponTypeID.DUAL:
		case WeaponTypeID.ONE_HANDED:
			// only P-type or S-type characters can wield small melee weapons
			if ((PrimaryID.P !== primary && SecondaryID.P !== secondary) && PrimaryID.S !== primary && SecondaryID.S !== secondary) {
				return false;
			}
			break;

		case WeaponTypeID.TWO_HANDED:
			// only P-type characters can wield 2H weapons
			if (PrimaryID.P !== primary && SecondaryID.P !== secondary) {
				return false;
			}
			break;

		case WeaponTypeID.MAGICAL:
			// only M-type characters can wield magical weapons
			if (PrimaryID.M !== primary && SecondaryID.M !== secondary) {
				return false;
			}
			break;

		case WeaponTypeID.RANGED:
			// only S-type characters can wield ranged weapons
			if (PrimaryID.S !== primary && SecondaryID.S !== secondary) {
				return false;
			}
			break;
	}

	// check weapon slot
	switch (slot) {
		case WieldID.MAIN:
			return -1 !== wield.indexOf(WieldID.MAIN) || -1 !== wield.indexOf(WieldID.BOTH);

		case WieldID.OFF: {
			const main: IWeapon = Weapons[char.main];
			const mainWield: WieldID[] = main.wield;

			// cannot equip a dual weapon in Off hand
			if (WeaponTypeID.DUAL === main.type || WeaponTypeID.DUAL === wpn.type) {
				return false;
			}

			// Barbarian job exception for weapons in Off hand
			if (JobID.BAR === char.job && Weapons[WeaponID.SPEAR] !== wpn) {
				return true;
			}

			// cannot equip any other weapon while wielding 2H weapon in Main hand
			if (-1 !== mainWield.indexOf(WieldID.BOTH)) {
				return false;
			}

			// only P-type and S-type  archetypes can wield non-shield weapon in Off hand
			if (WeaponTypeID.SHIELD !== wpn.type && PrimaryID.P !== primary && SecondaryID.P !== secondary && PrimaryID.S !== primary && SecondaryID.S !== secondary) {
				return false;
			}

			// only P-type characters can wield Large Shield
			if (Weapons.SHIELD_LARGE === wpn && PrimaryID.P !== primary && SecondaryID.P !== secondary) {
				return false;
			}

			return -1 !== wield.indexOf(WieldID.OFF);
		}

		default:
			throw new Error(`Invalid equip slot: ${slot}`);
	}
};

export const filter = (char: ICharacter, slot: WieldID): WeaponID[] => {
	const filtered: WeaponID[] = [];

	for (const id in Weapons) {
		const wpn: IWeapon = Weapons[id];

		if (check(wpn, char, slot)) {
			 filtered.push(id as WeaponID);
		}
	}

	return filtered;
};
