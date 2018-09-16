import { WieldID } from 'engine/equipment/wield';
import { ArmorID } from 'engine/equipment/armor-data';
import { WeaponID } from 'engine/equipment/weapon-data';
import { ArchetypeID } from 'engine/character/archetype';
import {
	ArchetypeIndexTable, WieldIndexTable,
	WeaponEquipTableArch, WeaponEquipTableWield, ArmorEquipTableArch
} from 'engine/equipment/equipable';

const getArchetypeIndex = (arch: ArchetypeID) => ArchetypeIndexTable[arch];
const getWieldIndex = (wield: WieldID) => WieldIndexTable[wield];

export class EquipmentUtils {
	public static checkWeaponArch(weapon: WeaponID, arch: ArchetypeID): boolean {
		return 1 === WeaponEquipTableArch[weapon][getArchetypeIndex(arch)];
	}

	public static checkWeaponWield(weapon: WeaponID, wield: WieldID): boolean {
		return 1 === WeaponEquipTableWield[weapon][getWieldIndex(wield)];
	}

	public static checkArmorArch(armor: ArmorID, arch: ArchetypeID): boolean {
		return 1 === ArmorEquipTableArch[armor][getArchetypeIndex(arch)];
	}

	public static checkMainHand(weapon: WeaponID, archetype: ArchetypeID) {
		return (
			EquipmentUtils.checkWeaponArch(weapon, archetype) && (
				EquipmentUtils.checkWeaponWield(weapon, 'MAIN') ||
				EquipmentUtils.checkWeaponWield(weapon, 'BOTH') ||
				EquipmentUtils.checkWeaponWield(weapon, 'DUAL')
			)
		);
	}

	public static checkOffHand(weapon: WeaponID, archetype: ArchetypeID, main: WeaponID) {
		return (
			EquipmentUtils.checkWeaponArch(weapon, archetype) &&
			EquipmentUtils.checkWeaponWield(weapon, 'OFF') &&
			!EquipmentUtils.checkWeaponWield(main, 'BOTH') &&
			!EquipmentUtils.checkWeaponWield(main, 'DUAL')
		);
	}

	public static checkArmor(armor: ArmorID, archetype: ArchetypeID): boolean {
		return EquipmentUtils.checkArmorArch(armor, archetype);
	}

	public static isBothWielding(main: WeaponID): boolean {
		return EquipmentUtils.checkWeaponWield(main, 'BOTH');
	}

	public static isDualWielding(main: WeaponID): boolean {
		return EquipmentUtils.checkWeaponWield(main, 'DUAL');
	}
}
