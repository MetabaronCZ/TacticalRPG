import { WieldID, IWield } from 'models/wield';
import { WeaponID, IWeapon } from 'models/weapon';
import { WeaponTypeID } from 'models/weapon-types';
import { ICharacter } from 'models/character';
import WeaponList from 'data/weapon-list';
import { ArchetypeCharacteristicID as ArchCharID } from 'models/archetype';
import { JobID } from 'models/job';

const check = (wpn: IWeapon, char: ICharacter, slot: WieldID): boolean => {
	const { primary, secondary } = char;
	const wield = wpn.wield;

	// check weapon type according to character archetype
	switch (wpn.type) {
		case WeaponTypeID.NONE:
			return true;

		case WeaponTypeID.DUAL:
		case WeaponTypeID.ONE_HANDED:
			// only P-type or S-type characters can wield small melee weapons
			if ((ArchCharID.P !== primary && ArchCharID.P !== secondary) && ArchCharID.S !== primary && ArchCharID.S !== secondary) {
				return false;
			}
			break;

		case WeaponTypeID.TWO_HANDED:
			// only P-type characters can wield 2H weapons
			if (ArchCharID.P !== primary && ArchCharID.P !== secondary) {
				return false;
			}
			break;

		case WeaponTypeID.MAGICAL:
			// only M-type characters can wield magical weapons
			if (ArchCharID.M !== primary && ArchCharID.M !== secondary) {
				return false;
			}
			break;

		case WeaponTypeID.RANGED:
			// only S-type characters can wield ranged weapons
			if (ArchCharID.S !== primary && ArchCharID.S !== secondary) {
				return false;
			}
			break;
	}

	// check weapon slot
	switch (slot) {
		case WieldID.MAIN:
			return -1 !== wield.indexOf(WieldID.MAIN) || -1 !== wield.indexOf(WieldID.BOTH);

		case WieldID.OFF: {
			const main = WeaponList.get(char.main);

			if (!main) {
				throw new Error('Weapon check error - invalid main WeaponID');
			}
			const mainWield = main.wield;

			// cannot equip a dual weapon in Off hand
			if (WeaponTypeID.DUAL === main.type || WeaponTypeID.DUAL === wpn.type) {
				return false;
			}

			// Barbarian job exception for weapons in Off hand
			if (JobID.BAR === char.job && WeaponList.get(WeaponID.SPEAR) !== wpn) {
				return true;
			}

			// cannot equip any other weapon while wielding 2H weapon in Main hand
			if (-1 !== mainWield.indexOf(WieldID.BOTH)) {
				return false;
			}

			// only P-type and S-type  archetypes can wield non-shield weapon in Off hand
			if (WeaponTypeID.SHIELD !== wpn.type && ArchCharID.P !== primary && ArchCharID.P !== secondary && ArchCharID.S !== primary && ArchCharID.S !== secondary) {
				return false;
			}

			// only P-type characters can wield Large Shield
			if (WeaponList.get(WeaponID.SHIELD_LARGE) === wpn && ArchCharID.P !== primary && ArchCharID.P !== secondary) {
				return false;
			}

			return -1 !== wield.indexOf(WieldID.OFF);
		}

		default:
			throw new Error(`Invalid equip slot: ${slot}`);
	}
};

export const filter = (char: ICharacter, slot: WieldID): Map<WeaponID, IWeapon> => {
	const filtered = new Map();

	WeaponList.forEach((wpn, id) => {
		if (check(wpn, char, slot)) {
			filtered.set(id, wpn);
		}
	});

	return filtered;
};
