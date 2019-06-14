import { DynamicSkillID } from 'modules/skill/dynamic';
import { SkillElement } from 'modules/skill/skill-data';
import { WeaponID } from 'modules/equipment/weapon-data';

type DynamicSkillTable = {
	[wpn in WeaponID]: {
		[elm in SkillElement]: DynamicSkillID | null;
	};
};

const dynamicSkillTable: DynamicSkillTable = {
	NONE:         { NONE: null, FIRE: null, ICE: null, WIND: null, EARTH: null, THUNDER: null, WATER: null, DARK: null, HOLY: null, PSYCHIC: null },
	ROD:          { NONE: null, FIRE: null, ICE: null, WIND: null, EARTH: null, THUNDER: null, WATER: null, DARK: null, HOLY: null, PSYCHIC: null },
	STAFF:        { NONE: null, FIRE: null, ICE: null, WIND: null, EARTH: null, THUNDER: null, WATER: null, DARK: null, HOLY: null, PSYCHIC: null },
	SHIELD_SMALL: { NONE: null, FIRE: null, ICE: null, WIND: null, EARTH: null, THUNDER: null, WATER: null, DARK: null, HOLY: null, PSYCHIC: null },
	SHIELD_LARGE: { NONE: null, FIRE: null, ICE: null, WIND: null, EARTH: null, THUNDER: null, WATER: null, DARK: null, HOLY: null, PSYCHIC: null },

	FISTS:     {
		NONE: null,
		FIRE: 'FST_FIR',
		ICE: 'FST_ICE',
		WIND: 'FST_WND',
		EARTH: 'FST_ERT',
		THUNDER: 'FST_THU',
		WATER: 'FST_WAT',
		DARK: 'FST_DRK',
		HOLY: 'FST_HOL',
		PSYCHIC: 'FST_PSY'
	},
	DAGGER: {
		NONE: null,
		FIRE: 'DGR_FIR',
		ICE: 'DGR_ICE',
		WIND: 'DGR_WND',
		EARTH: 'DGR_ERT',
		THUNDER: 'DGR_THU',
		WATER: 'DGR_WAT',
		DARK: 'DGR_DRK',
		HOLY: 'DGR_HOL',
		PSYCHIC: 'DGR_PSY'
	},
	SWORD_1H: {
		NONE: null,
		FIRE: 'S1H_FIR',
		ICE: 'S1H_ICE',
		WIND: 'S1H_WND',
		EARTH: 'S1H_ERT',
		THUNDER: 'S1H_THU',
		WATER: 'S1H_WAT',
		DARK: 'S1H_DRK',
		HOLY: 'S1H_HOL',
		PSYCHIC: 'S1H_PSY'
	},
	AXE_1H: {
		NONE: null,
		FIRE: 'A1H_FIR',
		ICE: 'A1H_ICE',
		WIND: 'A1H_WND',
		EARTH: 'A1H_ERT',
		THUNDER: 'A1H_THU',
		WATER: 'A1H_WAT',
		DARK: 'A1H_DRK',
		HOLY: 'A1H_HOL',
		PSYCHIC: 'A1H_PSY'
	},
	MACE_1H: {
		NONE: null,
		FIRE: 'M1H_FIR',
		ICE: 'M1H_ICE',
		WIND: 'M1H_WND',
		EARTH: 'M1H_ERT',
		THUNDER: 'M1H_THU',
		WATER: 'M1H_WAT',
		DARK: 'M1H_DRK',
		HOLY: 'M1H_HOL',
		PSYCHIC: 'M1H_PSY'
	},
	SPEAR: {
		NONE: null,
		FIRE: 'SPR_FIR',
		ICE: 'SPR_ICE',
		WIND: 'SPR_WND',
		EARTH: 'SPR_ERT',
		THUNDER: 'SPR_THU',
		WATER: 'SPR_WAT',
		DARK: 'SPR_DRK',
		HOLY: 'SPR_HOL',
		PSYCHIC: 'SPR_PSY'
	},
	SWORD_2H: {
		NONE: null,
		FIRE: 'S2H_FIR',
		ICE: 'S2H_ICE',
		WIND: 'S2H_WND',
		EARTH: 'S2H_ERT',
		THUNDER: 'S2H_THU',
		WATER: 'S2H_WAT',
		DARK: 'S2H_DRK',
		HOLY: 'S2H_HOL',
		PSYCHIC: 'S2H_PSY'
	},
	AXE_2H: {
		NONE: null,
		FIRE: 'A2H_FIR',
		ICE: 'A2H_ICE',
		WIND: 'A2H_WND',
		EARTH: 'A2H_ERT',
		THUNDER: 'A2H_THU',
		WATER: 'A2H_WAT',
		DARK: 'A2H_DRK',
		HOLY: 'A2H_HOL',
		PSYCHIC: 'A2H_PSY'
	},
	MACE_2H: {
		NONE: null,
		FIRE: 'M2H_FIR',
		ICE: 'M2H_ICE',
		WIND: 'M2H_WND',
		EARTH: 'M2H_ERT',
		THUNDER: 'M2H_THU',
		WATER: 'M2H_WAT',
		DARK: 'M2H_DRK',
		HOLY: 'M2H_HOL',
		PSYCHIC: 'M2H_PSY'
	},
	BOW: {
		NONE: null,
		FIRE: 'BOW_FIR',
		ICE: 'BOW_ICE',
		WIND: 'BOW_WND',
		EARTH: 'BOW_ERT',
		THUNDER: 'BOW_THU',
		WATER: 'BOW_WAT',
		DARK: 'BOW_DRK',
		HOLY: 'BOW_HOL',
		PSYCHIC: 'BOW_PSY'
	},
	GUN: {
		NONE: null,
		FIRE: 'GUN_FIR',
		ICE: 'GUN_ICE',
		WIND: 'GUN_WND',
		EARTH: 'GUN_ERT',
		THUNDER: 'GUN_THU',
		WATER: 'GUN_WAT',
		DARK: 'GUN_DRK',
		HOLY: 'GUN_HOL',
		PSYCHIC: 'GUN_PSY'
	}
};

export default dynamicSkillTable;
