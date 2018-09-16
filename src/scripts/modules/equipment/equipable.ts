import { WieldID } from 'engine/wield';
import { ArmorID } from 'engine/armor-data';
import { WeaponID } from 'engine/weapon-data';
import { ArchetypeID } from 'engine/character/archetype';

type IArchetypeIndexTable = {
	[id in ArchetypeID]: number;
};

type IWieldIndexTable = {
	[id in WieldID]: number;
};

type IArchetypeEquipRow = [0|1, 0|1, 0|1, 0|1, 0|1, 0|1];
type IWieldEquipRow = [0|1, 0|1, 0|1, 0|1];

type IWeaponEquipArchTable = {
	[id in WeaponID]: IArchetypeEquipRow;
};

type IWeaponEquipWieldTable = {
	[id in WeaponID]: IWieldEquipRow;
};

type IArmorEquipTable = {
	[id in ArmorID]: IArchetypeEquipRow;
};

const ArchetypeIndexTable: IArchetypeIndexTable = {
	PP: 0,
	PS: 1,
	PM: 2,
	SS: 3,
	SM: 4,
	MM: 5
};

const WieldIndexTable: IWieldIndexTable = {
	MAIN: 0,
	BOTH: 1,
	OFF:  2,
	DUAL: 3
};

const WeaponEquipTableArch: IWeaponEquipArchTable = {
	//             PP PS PM SS SM MM
	NONE:         [1, 1, 1, 1, 1, 1],
	FISTS:        [0, 1, 0, 1, 1, 0],
	DAGGER:       [0, 1, 0, 1, 1, 0],
	SWORD_1H:     [1, 1, 1, 1, 1, 1],
	AXE_1H:       [1, 1, 1, 1, 1, 1],
	HAMMER_1H:    [1, 1, 1, 1, 1, 1],
	SPEAR:        [1, 1, 1, 0, 0, 0],
	SWORD_2H:     [1, 1, 1, 0, 0, 0],
	AXE_2H:       [1, 1, 1, 0, 0, 0],
	HAMMER_2H:    [1, 1, 1, 0, 0, 0],
	MACE:         [0, 0, 1, 0, 1, 1],
	STAFF:        [0, 0, 1, 0, 1, 1],
	BOW:          [0, 1, 0, 1, 1, 0],
	GUN_1H:       [0, 1, 0, 1, 1, 0],
	GUN_2H:       [0, 1, 0, 1, 1, 0],
	SHIELD_SMALL: [1, 1, 1, 1, 1, 1],
	SHIELD_LARGE: [1, 1, 1, 0, 0, 0]
};

const WeaponEquipTableWield: IWeaponEquipWieldTable = {
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
	MACE:         [1,   0,   0,   0],
	STAFF:        [0,   1,   0,   0],
	BOW:          [0,   1,   0,   0],
	GUN_1H:       [1,   0,   1,   0],
	GUN_2H:       [0,   1,   0,   0],
	SHIELD_SMALL: [0,   0,   1,   0],
	SHIELD_LARGE: [0,   0,   1,   0]
};

const ArmorEquipTableArch: IArmorEquipTable = {
	//      PP PS PM SS SM MM
	NONE:  [1, 1, 1, 1, 1, 1],
	ROBE:  [0, 0, 1, 0, 1, 1],
	LIGHT: [0, 1, 0, 1, 1, 0],
	HEAVY: [1, 1, 1, 0, 0, 0]
};

const getArchetypeIndex = (arch: ArchetypeID) => ArchetypeIndexTable[arch];
const getWieldIndex = (wield: WieldID) => WieldIndexTable[wield];

export const checkWeaponArch = (weapon: WeaponID, arch: ArchetypeID) => 1 === WeaponEquipTableArch[weapon][getArchetypeIndex(arch)];
export const checkWeaponWield = (weapon: WeaponID, wield: WieldID) => 1 === WeaponEquipTableWield[weapon][getWieldIndex(wield)];
export const checkArmorArch = (armor: ArmorID, arch: ArchetypeID) => 1 === ArmorEquipTableArch[armor][getArchetypeIndex(arch)];
