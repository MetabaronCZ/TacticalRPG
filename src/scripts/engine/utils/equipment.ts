import { WieldID } from 'engine/equipment/wield';
import { ArmorID } from 'engine/equipment/armor-data';
import { WeaponID } from 'engine/equipment/weapon-data';
import { ArchetypeID } from 'engine/character/archetype';
import { ArchetypeIndexTable, WieldIndexTable, WeaponEquipTableArch, WeaponEquipTableWield, ArmorEquipTableArch } from 'data/equipment';

const getArchetypeIndex = (arch: ArchetypeID) => ArchetypeIndexTable[arch];
const getWieldIndex = (wield: WieldID) => WieldIndexTable[wield];

export const checkWeaponArchetype = (weapon: WeaponID, arch: ArchetypeID): boolean => {
	return 1 === WeaponEquipTableArch[weapon][getArchetypeIndex(arch)];
};

export const checkWeaponWield = (weapon: WeaponID, wield: WieldID): boolean => {
	return 1 === WeaponEquipTableWield[weapon][getWieldIndex(wield)];
};

export const checkArmorArchetype = (armor: ArmorID, arch: ArchetypeID): boolean => {
	return 1 === ArmorEquipTableArch[armor][getArchetypeIndex(arch)];
};

export const checkMainHand = (weapon: WeaponID, archetype: ArchetypeID): boolean => {
	return checkWeaponArchetype(weapon, archetype) && (
		checkWeaponWield(weapon, 'MAIN') ||
		checkWeaponWield(weapon, 'BOTH') ||
		checkWeaponWield(weapon, 'DUAL')
	);
};

export const checkOffHand = (weapon: WeaponID, archetype: ArchetypeID, main: WeaponID): boolean => {
	return (
		checkWeaponArchetype(weapon, archetype) &&
		checkWeaponWield(weapon, 'OFF') &&
		!checkWeaponWield(main, 'BOTH') &&
		!checkWeaponWield(main, 'DUAL')
	);
};

export const isBothWielding = (main: WeaponID): boolean => {
	return checkWeaponWield(main, 'BOTH');
};

export const isDualWielding = (main: WeaponID): boolean => {
	return checkWeaponWield(main, 'DUAL');
};
