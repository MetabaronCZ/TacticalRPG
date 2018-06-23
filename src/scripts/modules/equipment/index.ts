import { ArchetypeID } from 'modules/archetype/types';
import { WeaponID } from 'modules/weapon/types';
import { ArmorID } from 'modules/armor/types';
import { WieldID } from 'modules/wield/types';
import { checkWeaponArch, checkWeaponWield, checkArmorArch } from 'modules/equipment/equipable';

const checkMainHand = (weapon: WeaponID, archetype: ArchetypeID) => {
	return (
		checkWeaponArch(weapon, archetype) && (
			checkWeaponWield(weapon, WieldID.MAIN) ||
			checkWeaponWield(weapon, WieldID.BOTH) ||
			checkWeaponWield(weapon, WieldID.DUAL)
		)
	);
};

const checkOffHand = (weapon: WeaponID, archetype: ArchetypeID, main: WeaponID) => {
	return (
		checkWeaponArch(weapon, archetype) &&
		checkWeaponWield(weapon, WieldID.OFF) &&
		!checkWeaponWield(main, WieldID.BOTH) &&
		!checkWeaponWield(main, WieldID.DUAL)
	);
};

const checkArmor = (armor: ArmorID, archetype: ArchetypeID) => {
	return checkArmorArch(armor, archetype);
};

const isBothWielding = (main: WeaponID): boolean => {
	return checkWeaponWield(main, WieldID.BOTH);
};

const isDualWielding = (main: WeaponID): boolean => {
	return checkWeaponWield(main, WieldID.DUAL);
};

const Equipment = {
	checkMainHand,
	checkOffHand,
	checkArmor,
	isBothWielding,
	isDualWielding
};

export default Equipment;
