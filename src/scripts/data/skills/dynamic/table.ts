import { ElementID } from 'modules/skill/affinity';
import { DynamicSkillID } from 'modules/skill/dynamic';
import { WeaponID } from 'modules/equipment/weapon-data';

type DynamicSkillTable = {
	readonly [wpn in WeaponID]: {
		readonly [elm in ElementID]: DynamicSkillID | null;
	};
};

const dynamicSkillTable: DynamicSkillTable = {
	NONE:         { FIRE: null, ICE: null, WIND: null, EARTH: null, THUNDER: null, WATER: null, DARK: null, HOLY: null, KINETIC: null },
	ROD:          { FIRE: null, ICE: null, WIND: null, EARTH: null, THUNDER: null, WATER: null, DARK: null, HOLY: null, KINETIC: null },
	STAFF:        { FIRE: null, ICE: null, WIND: null, EARTH: null, THUNDER: null, WATER: null, DARK: null, HOLY: null, KINETIC: null },
	SHIELD_SMALL: { FIRE: null, ICE: null, WIND: null, EARTH: null, THUNDER: null, WATER: null, DARK: null, HOLY: null, KINETIC: null },
	SHIELD_LARGE: { FIRE: null, ICE: null, WIND: null, EARTH: null, THUNDER: null, WATER: null, DARK: null, HOLY: null, KINETIC: null },

	FISTS: {
		FIRE: 'FST_FIR',
		ICE: 'FST_ICE',
		WIND: 'FST_WND',
		EARTH: 'FST_ERT',
		THUNDER: 'FST_THU',
		WATER: 'FST_WAT',
		DARK: 'FST_DRK',
		HOLY: 'FST_HOL',
		KINETIC: 'FST_PSY'
	},
	DAGGER: {
		FIRE: 'DGR_FIR',
		ICE: 'DGR_ICE',
		WIND: 'DGR_WND',
		EARTH: 'DGR_ERT',
		THUNDER: 'DGR_THU',
		WATER: 'DGR_WAT',
		DARK: 'DGR_DRK',
		HOLY: 'DGR_HOL',
		KINETIC: 'DGR_PSY'
	},
	SWORD_1H: {
		FIRE: 'S1H_FIR',
		ICE: 'S1H_ICE',
		WIND: 'S1H_WND',
		EARTH: 'S1H_ERT',
		THUNDER: 'S1H_THU',
		WATER: 'S1H_WAT',
		DARK: 'S1H_DRK',
		HOLY: 'S1H_HOL',
		KINETIC: 'S1H_PSY'
	},
	AXE_1H: {
		FIRE: 'A1H_FIR',
		ICE: 'A1H_ICE',
		WIND: 'A1H_WND',
		EARTH: 'A1H_ERT',
		THUNDER: 'A1H_THU',
		WATER: 'A1H_WAT',
		DARK: 'A1H_DRK',
		HOLY: 'A1H_HOL',
		KINETIC: 'A1H_PSY'
	},
	MACE_1H: {
		FIRE: 'M1H_FIR',
		ICE: 'M1H_ICE',
		WIND: 'M1H_WND',
		EARTH: 'M1H_ERT',
		THUNDER: 'M1H_THU',
		WATER: 'M1H_WAT',
		DARK: 'M1H_DRK',
		HOLY: 'M1H_HOL',
		KINETIC: 'M1H_PSY'
	},
	SPEAR: {
		FIRE: 'SPR_FIR',
		ICE: 'SPR_ICE',
		WIND: 'SPR_WND',
		EARTH: 'SPR_ERT',
		THUNDER: 'SPR_THU',
		WATER: 'SPR_WAT',
		DARK: 'SPR_DRK',
		HOLY: 'SPR_HOL',
		KINETIC: 'SPR_PSY'
	},
	SWORD_2H: {
		FIRE: 'S2H_FIR',
		ICE: 'S2H_ICE',
		WIND: 'S2H_WND',
		EARTH: 'S2H_ERT',
		THUNDER: 'S2H_THU',
		WATER: 'S2H_WAT',
		DARK: 'S2H_DRK',
		HOLY: 'S2H_HOL',
		KINETIC: 'S2H_PSY'
	},
	AXE_2H: {
		FIRE: 'A2H_FIR',
		ICE: 'A2H_ICE',
		WIND: 'A2H_WND',
		EARTH: 'A2H_ERT',
		THUNDER: 'A2H_THU',
		WATER: 'A2H_WAT',
		DARK: 'A2H_DRK',
		HOLY: 'A2H_HOL',
		KINETIC: 'A2H_PSY'
	},
	MACE_2H: {
		FIRE: 'M2H_FIR',
		ICE: 'M2H_ICE',
		WIND: 'M2H_WND',
		EARTH: 'M2H_ERT',
		THUNDER: 'M2H_THU',
		WATER: 'M2H_WAT',
		DARK: 'M2H_DRK',
		HOLY: 'M2H_HOL',
		KINETIC: 'M2H_PSY'
	},
	AETHERBLADE: {
		FIRE: 'ATB_FIR',
		ICE: 'ATB_ICE',
		WIND: 'ATB_WND',
		EARTH: 'ATB_ERT',
		THUNDER: 'ATB_THU',
		WATER: 'ATB_WAT',
		DARK: 'ATB_DRK',
		HOLY: 'ATB_HOL',
		KINETIC: 'ATB_PSY'
	},
	BOW: {
		FIRE: 'BOW_FIR',
		ICE: 'BOW_ICE',
		WIND: 'BOW_WND',
		EARTH: 'BOW_ERT',
		THUNDER: 'BOW_THU',
		WATER: 'BOW_WAT',
		DARK: 'BOW_DRK',
		HOLY: 'BOW_HOL',
		KINETIC: 'BOW_PSY'
	},
	GUN: {
		FIRE: 'GUN_FIR',
		ICE: 'GUN_ICE',
		WIND: 'GUN_WND',
		EARTH: 'GUN_ERT',
		THUNDER: 'GUN_THU',
		WATER: 'GUN_WAT',
		DARK: 'GUN_DRK',
		HOLY: 'GUN_HOL',
		KINETIC: 'GUN_PSY'
	}
};

export default dynamicSkillTable;
