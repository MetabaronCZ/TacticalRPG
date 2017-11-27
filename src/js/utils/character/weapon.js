import { WieldID } from 'models/wield';
import Weapons from 'data/weapons';
import { EWeaponTypes } from 'models/weapon-types';

const check = (wpn, char, slot) => {
	let primary = char.primary;
	let secondary = char.secondary;
	let wield = wpn.wield;

	// check weapon type according to character archetype
	switch ( wpn.type ){
		case EWeaponTypes.NONE:
			return true;

		case EWeaponTypes.DUAL:
		case EWeaponTypes.ONE_HANDED:
			// only P-type or S-type characters can wield small melee weapons
			if ( ('P' !== primary && 'P' !== secondary) && 'S' !== primary && 'S' !== secondary ){
				return false;
			}
			break;

		case EWeaponTypes.TWO_HANDED:
			// only P-type characters can wield 2H weapons
			if ( 'P' !== primary && 'P' !== secondary ){
				return false;
			}
			break;

		case EWeaponTypes.MAGICAL:
			// only M-type characters can wield magical weapons
			if ( 'M' !== primary && 'M' !== secondary ){
				return false;
			}
			break;

		case EWeaponTypes.RANGED:
			// only S-type characters can wield ranged weapons
			if ( 'S' !== primary && 'S' !== secondary ){
				return false;
			}
			break;
	}

	// check weapon slot
	switch ( slot ){
		case WieldID.MAIN:
			return ( wield.includes(WieldID.MAIN) || wield.includes(WieldID.BOTH) );

		case WieldID.OFF: {
			let main = Weapons[char.main];
			let mainWield = main.wield;

			// cannot equip a dual weapon in Off hand
			if ( EWeaponTypes.DUAL === main.type || EWeaponTypes.DUAL === wpn.type ){
				return false;
			}

			// Barbarian job exception for weapons in Off hand
			if ( 'BAR' === char.job && Weapons.SPEAR !== wpn ){
				return true;
			}

			// cannot equip any other weapon while wielding 2H weapon in Main hand
			if ( mainWield.includes(WieldID.BOTH) ){
				return false;
			}

			// only P-type and S-type  archetypes can wield non-shield weapon in Off hand
			if ( EWeaponTypes.SHIELD !== wpn.type && 'P' !== primary && 'P' !== secondary && 'S' !== primary && 'S' !== secondary ){
				return false;
			}

			// only P-type characters can wield Large Shield
			if ( Weapons.SHIELD_LARGE === wpn && 'P' !== primary && 'P' !== secondary ){
				return false;
			}

			return wield.includes(WieldID.OFF);
		}

		default:
			throw new Error(`Invalid equip slot: ${slot}`);
	}
};

export const filter = (char, slot) => {
	return Object.keys(Weapons).filter(wpn => {
		return check(Weapons[wpn], char, slot);
	});
};
