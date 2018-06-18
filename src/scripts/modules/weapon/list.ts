import DataList from 'core/data-list';

import { WieldID } from 'modules/wield';
import { ArchetypeID } from 'modules/archetype';
import { ICharacterData } from 'modules/character-data';
import { WeaponID, WeaponTypeID, IWeaponData } from 'modules/weapon';

const PP = ArchetypeID.PP;
const PS = ArchetypeID.PS;
const PM = ArchetypeID.PM;
const SS = ArchetypeID.SS;
const SM = ArchetypeID.SM;
const MM = ArchetypeID.MM;

class WeaponList extends DataList<WeaponID, IWeaponData> {
	public filter(char: ICharacterData, slot: WieldID) {
		return super.filterFn((id, wpn) => this.check(wpn, char, slot));
	}

	private check(wpn: IWeaponData, char: ICharacterData, slot: WieldID): boolean {
		const archetype = char.archetype;
		const wield = wpn.wield;

		// check weapon type according to character archetype
		switch (wpn.type) {
			case WeaponTypeID.NONE:
				return true;

			case WeaponTypeID.DUAL:
			case WeaponTypeID.ONE_HANDED:
				// only P-type or S-type characters can wield small melee weapons
				if (-1 === [PP, PS, PM, SS, SM].indexOf(archetype)) {
					return false;
				}
				break;

			case WeaponTypeID.TWO_HANDED:
				// only P-type characters can wield 2H weapons
				if (-1 === [PP, PS, PM].indexOf(archetype)) {
					return false;
				}
				break;

			case WeaponTypeID.MAGICAL:
				// only M-type characters can wield magical weapons
				if (-1 === [PM, SM, MM].indexOf(archetype)) {
					return false;
				}
				break;

			case WeaponTypeID.RANGED:
				// only S-type characters can wield ranged weapons
				if (-1 === [PS, SS, SM].indexOf(archetype)) {
					return false;
				}
				break;
		}

		// check weapon slot
		switch (slot) {
			case WieldID.MAIN:
				return -1 !== wield.indexOf(WieldID.MAIN) || -1 !== wield.indexOf(WieldID.BOTH)  || -1 !== wield.indexOf(WieldID.DUAL);

			case WieldID.OFF: {
				const main = this.get(char.main);
				const mainWield = main.wield;

				// only main hand can equip a dual wield weapon
				if (-1 !== mainWield.indexOf(WieldID.DUAL) || -1 !== wield.indexOf(WieldID.DUAL)) {
					return false;
				}

				// cannot equip any other weapon while wielding 2H weapon in main hand
				if (-1 !== mainWield.indexOf(WieldID.BOTH)) {
					return false;
				}

				// only P-type and S-type archetypes can wield non-shield in off hand
				if (WeaponTypeID.SHIELD !== wpn.type && -1 === [PP, PS, PM, SS, SM].indexOf(archetype)) {
					return false;
				}

				// only P-type characters can wield large shield
				if (this.get(WeaponID.SHIELD_LARGE) === wpn && -1 === [PP, PS, PM].indexOf(archetype)) {
					return false;
				}

				return -1 !== wield.indexOf(WieldID.OFF);
			}

			default:
				throw new Error(`Invalid equip slot: ${slot}`);
		}
	}
}

export default WeaponList;
