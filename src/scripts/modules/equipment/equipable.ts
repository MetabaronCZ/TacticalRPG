import { ArchetypeID } from 'modules/archetype/types';
import { WeaponID } from 'modules/weapon/types';
import { ArmorID } from 'modules/armor/types';
import { WieldID } from 'modules/wield/types';

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
	[ArchetypeID.PP]: 0,
	[ArchetypeID.PS]: 1,
	[ArchetypeID.PM]: 2,
	[ArchetypeID.SS]: 3,
	[ArchetypeID.SM]: 4,
	[ArchetypeID.MM]: 5
};

const WieldIndexTable: IWieldIndexTable = {
	[WieldID.MAIN]: 0,
	[WieldID.BOTH]: 1,
	[WieldID.OFF]:  2,
	[WieldID.DUAL]: 3
};

const WeaponEquipTableArch: IWeaponEquipArchTable = {
	//                        PP PS PM SS SM MM
	[WeaponID.NONE]:         [1, 1, 1, 1, 1, 1],
	[WeaponID.FISTS]:        [0, 1, 0, 1, 1, 0],
	[WeaponID.DAGGER]:       [0, 1, 0, 1, 1, 0],
	[WeaponID.SWORD_1H]:     [1, 1, 1, 1, 1, 1],
	[WeaponID.AXE_1H]:       [1, 1, 1, 1, 1, 1],
	[WeaponID.HAMMER_1H]:    [1, 1, 1, 1, 1, 1],
	[WeaponID.SPEAR]:        [1, 1, 1, 0, 0, 0],
	[WeaponID.SWORD_2H]:     [1, 1, 1, 0, 0, 0],
	[WeaponID.AXE_2H]:       [1, 1, 1, 0, 0, 0],
	[WeaponID.HAMMER_2H]:    [1, 1, 1, 0, 0, 0],
	[WeaponID.MACE]:         [0, 0, 1, 0, 1, 1],
	[WeaponID.STAFF]:        [0, 0, 1, 0, 1, 1],
	[WeaponID.BOW]:          [0, 1, 0, 1, 1, 0],
	[WeaponID.GUN_1H]:       [0, 1, 0, 1, 1, 0],
	[WeaponID.GUN_2H]:       [0, 1, 0, 1, 1, 0],
	[WeaponID.SHIELD_SMALL]: [1, 1, 1, 1, 1, 1],
	[WeaponID.SHIELD_LARGE]: [1, 1, 1, 0, 0, 0]
};

const WeaponEquipTableWield: IWeaponEquipWieldTable = {
	//                        MAIN BOTH OFF  DUAL
	[WeaponID.NONE]:         [1,   0,   1,   0],
	[WeaponID.FISTS]:        [0,   0,   0,   1],
	[WeaponID.DAGGER]:       [1,   0,   1,   0],
	[WeaponID.SWORD_1H]:     [1,   0,   1,   0],
	[WeaponID.AXE_1H]:       [1,   0,   1,   0],
	[WeaponID.HAMMER_1H]:    [1,   0,   1,   0],
	[WeaponID.SPEAR]:        [0,   1,   0,   0],
	[WeaponID.SWORD_2H]:     [0,   1,   0,   0],
	[WeaponID.AXE_2H]:       [0,   1,   0,   0],
	[WeaponID.HAMMER_2H]:    [0,   1,   0,   0],
	[WeaponID.MACE]:         [1,   0,   0,   0],
	[WeaponID.STAFF]:        [0,   1,   0,   0],
	[WeaponID.BOW]:          [0,   1,   0,   0],
	[WeaponID.GUN_1H]:       [1,   0,   1,   0],
	[WeaponID.GUN_2H]:       [0,   1,   0,   0],
	[WeaponID.SHIELD_SMALL]: [0,   0,   1,   0],
	[WeaponID.SHIELD_LARGE]: [0,   0,   1,   0]
};

const ArmorEquipTableArch: IArmorEquipTable = {
	//                PP PS PM SS SM MM
	[ArmorID.NONE]:  [1, 1, 1, 1, 1, 1],
	[ArmorID.ROBE]:  [0, 0, 1, 0, 1, 1],
	[ArmorID.LIGHT]: [0, 1, 0, 1, 1, 0],
	[ArmorID.HEAVY]: [1, 1, 1, 0, 0, 0]
};

const getArchetypeIndex = (arch: ArchetypeID) => ArchetypeIndexTable[arch];
const getWieldIndex = (wield: WieldID) => WieldIndexTable[wield];

export const checkWeaponArch = (weapon: WeaponID, arch: ArchetypeID) => 1 === WeaponEquipTableArch[weapon][getArchetypeIndex(arch)];
export const checkWeaponWield = (weapon: WeaponID, wield: WieldID) => 1 === WeaponEquipTableWield[weapon][getWieldIndex(wield)];
export const checkArmorArch = (armor: ArmorID, arch: ArchetypeID) => 1 === ArmorEquipTableArch[armor][getArchetypeIndex(arch)];