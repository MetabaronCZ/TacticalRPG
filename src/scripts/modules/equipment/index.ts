import { ArmorID } from 'modules/armor/types';
import { WeaponID } from 'modules/weapon/types';
import { checkWeaponArch, checkWeaponWield, checkArmorArch } from 'modules/equipment/equipable';

import { ArchetypeID } from 'engine/character/archetype';

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
