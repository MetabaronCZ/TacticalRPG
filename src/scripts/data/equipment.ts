import { WieldID } from 'modules/equipment/wield-data';
import { ArmorID } from 'modules/equipment/armor-data';
import { WeaponID } from 'modules/equipment/weapon-data';
import { ArchetypeID } from 'modules/character/archetype';

type IArchetypeIndexTable = {
	[id in ArchetypeID]: number;
};

type IWieldIndexTable = {
	[id in WieldID]: number;
};

type bool = 0 | 1;

type IArchetypeEquipRow = [bool, bool, bool, bool, bool, bool];
type IWieldEquipRow = [bool, bool, bool, bool];

type IWeaponEquipArchTable = {
	[id in WeaponID]: IArchetypeEquipRow;
};

type IWeaponEquipWieldTable = {
	[id in WeaponID]: IWieldEquipRow;
};

type IArmorEquipTable = {
	[id in ArmorID]: IArchetypeEquipRow;
};

export const ArchetypeIndexTable: IArchetypeIndexTable = {
	PP: 0,
	PS: 1,
	PM: 2,
	SS: 3,
	SM: 4,
	MM: 5
};

export const WieldIndexTable: IWieldIndexTable = {
	MAIN: 0,
	BOTH: 1,
	OFF:  2,
	DUAL: 3
};

export const WeaponEquipTableArch: IWeaponEquipArchTable = {
	//             PP PS PM SS SM MM
	NONE:         [1, 1, 1, 1, 1, 1],
	FISTS:        [0, 1, 0, 1, 1, 0],
	DAGGER:       [0, 1, 0, 1, 1, 0],
	SWORD_1H:     [1, 1, 1, 1, 1, 0],
	AXE_1H:       [1, 1, 1, 1, 1, 0],
	HAMMER_1H:    [1, 1, 1, 1, 1, 0],
	SPEAR:        [1, 1, 1, 0, 0, 0],
	SWORD_2H:     [1, 1, 1, 0, 0, 0],
	AXE_2H:       [1, 1, 1, 0, 0, 0],
	HAMMER_2H:    [1, 1, 1, 0, 0, 0],
	ROD:          [0, 0, 1, 0, 1, 1],
	STAFF:        [0, 0, 1, 0, 1, 1],
	BOW:          [0, 1, 0, 1, 1, 0],
	GUN:          [0, 1, 0, 1, 1, 0],
	SHIELD_SMALL: [1, 1, 1, 1, 1, 1],
	SHIELD_LARGE: [1, 1, 1, 0, 0, 0]
};

export const WeaponEquipTableWield: IWeaponEquipWieldTable = {
	//             MAIN BOTH OFF  DUAL
	NONE:         [1,   0,   1,   0],
	FISTS:        [0,   0,   0,   1],
	DAGGER:       [1,   0,   1,   0],
	SWORD_1H:     [1,   0,   1,   0],
	AXE_1H:       [1,   0,   1,   0],
	HAMMER_1H:    [1,   0,   1,   0],
	SPEAR:        [0,   1,   0,   0],
	SWORD_2H:     [0,   1,   0,   0],
	AXE_2H:       [0,   1,   0,   0],
	HAMMER_2H:    [0,   1,   0,   0],
	ROD:          [1,   0,   0,   0],
	STAFF:        [0,   1,   0,   0],
	BOW:          [0,   1,   0,   0],
	GUN:          [1,   0,   1,   0],
	SHIELD_SMALL: [0,   0,   1,   0],
	SHIELD_LARGE: [0,   0,   1,   0]
};

export const ArmorEquipTableArch: IArmorEquipTable = {
	//         PP PS PM SS SM MM
	NONE:     [1, 1, 1, 1, 1, 1],
	HEAVY:    [1, 1, 1, 0, 0, 0],
	LIGHT:    [0, 1, 0, 1, 1, 0],
	MAGICAL:  [0, 0, 1, 0, 1, 1]
};

export const safeOffHand: WeaponID[] = ['NONE', 'SHIELD_SMALL', 'SHIELD_LARGE'];
