import * as Wield from 'data/wield';
import weapons, { Types } from 'data/weapon';

const check = (wpn, char, slot) => {
	let primary = char.primary;
	let secondary = char.secondary;
	let wield = wpn.wield;

	// check weapon type according to character archetype
	switch ( wpn.type ){
		case Types.NONE:
			return true;

		case Types.DUAL:
		case Types.ONE_HANDED:
			// only P-type or S-type characters can wield small melee weapons
			if ( ('P' !== primary && 'P' !== secondary) && 'S' !== primary && 'S' !== secondary ){
				return false;
			}
			break;

		case Types.TWO_HANDED:
			// only P-type characters can wield 2H weapons
			if ( 'P' !== primary && 'P' !== secondary ){
				return false;
			}
			break;

		case Types.MAGICAL:
			// only M-type characters can wield magical weapons
			if ( 'M' !== primary && 'M' !== secondary ){
				return false;
			}
			break;

		case Types.RANGED:
			// only S-type characters can wield ranged weapons
			if ( 'S' !== primary && 'S' !== secondary ){
				return false;
			}
			break;
	}

	// check weapon slot
	switch ( slot ){
		case Wield.MAIN:
			return ( wield.includes(Wield.MAIN) || wield.includes(Wield.BOTH) );

		case Wield.OFF: {
			let main = weapons[char.main];
			let mainWield = main.wield;

			// cannot equip a dual weapon in Off hand
			if ( Types.DUAL === main.type || Types.DUAL === wpn.type ){
				return false;
			}

			// Barbarian class exception for weapons in Off hand
			if ( 'BAR' === char.class && weapons.SPEAR !== wpn ){
				return true;
			}

			// cannot equip any other weapon while wielding 2H weapon in Main hand
			if ( mainWield.includes(Wield.BOTH) ){
				return false;
			}

			// only P-type and S-type  archetypes can wield non-shield weapon in Off hand
			if ( Types.SHIELD !== wpn.type && 'P' !== primary && 'P' !== secondary && 'S' !== primary && 'S' !== secondary ){
				return false;
			}

			// only P-type characters can wield Large Shield
			if ( weapons.SHIELD_LARGE === wpn && 'P' !== primary && 'P' !== secondary ){
				return false;
			}

			return wield.includes(Wield.OFF);
		}

		default:
			throw new Error(`Invalid equip slot: ${slot}`);
	}
};

export const filter = (char, slot) => {
	return Object.keys(weapons).filter(wpn => {
		return check(weapons[wpn], char, slot);
	});
};
