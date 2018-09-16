import { ArmorID } from 'engine/armor-data';
import { WeaponID } from 'engine/weapon-data';
import { ArchetypeID } from 'engine/character/archetype';

import { checkWeaponArch, checkWeaponWield, checkArmorArch } from 'modules/equipment/equipable';

const checkMainHand = (weapon: WeaponID, archetype: ArchetypeID) => {
	return (
		checkWeaponArch(weapon, archetype) && (
			checkWeaponWield(weapon, 'MAIN') ||
			checkWeaponWield(weapon, 'BOTH') ||
			checkWeaponWield(weapon, 'DUAL')
		)
	);
};

const checkOffHand = (weapon: WeaponID, archetype: ArchetypeID, main: WeaponID) => {
	return (
		checkWeaponArch(weapon, archetype) &&
		checkWeaponWield(weapon, 'OFF') &&
		!checkWeaponWield(main, 'BOTH') &&
		!checkWeaponWield(main, 'DUAL')
	);
};

const checkArmor = (armor: ArmorID, archetype: ArchetypeID) => {
	return checkArmorArch(armor, archetype);
};

const isBothWielding = (main: WeaponID): boolean => {
	return checkWeaponWield(main, 'BOTH');
};

const isDualWielding = (main: WeaponID): boolean => {
	return checkWeaponWield(main, 'DUAL');
};

const Equipment = {
	checkMainHand,
	checkOffHand,
	checkArmor,
	isBothWielding,
	isDualWielding
};

export default Equipment;
