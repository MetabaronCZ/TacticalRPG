import * as Wield from 'data/wield';

export const Types = {
	NONE: 'NONE',
	DUAL: 'DUAL',
	ONE_HANDED: 'ONE_HANDED',
	TWO_HANDED: 'TWO_HANDED',
	MAGICAL: 'MAGICAL',
	RANGED: 'RANGED',
	SHIELD: 'SHIELD'
};

export default {
	NONE: {
		title: 'none',
		description: 'No weapon equipped',
		type: Types.NONE,
		wield: [Wield.MAIN, Wield.OFF]
	},
	FISTS: {
		title: 'Fists',
		description: '',
		type: Types.DUAL,
		wield: [Wield.BOTH]
	},
	DAGGER: {
		title: 'Dagger',
		description: '',
		type: Types.ONE_HANDED,
		wield: [Wield.MAIN, Wield.OFF]
	},
	SWORD_1H: {
		title: '1H Sword',
		description: '',
		type: Types.ONE_HANDED,
		wield: [Wield.MAIN, Wield.OFF]
	},
	AXE_1H: {
		title: '1H Axe',
		description: '',
		type: Types.ONE_HANDED,
		wield: [Wield.MAIN, Wield.OFF]
	},
	HAMMER_1H: {
		title: '1H Hammer',
		description: '',
		type: Types.ONE_HANDED,
		wield: [Wield.MAIN, Wield.OFF]
	},
	SPEAR: {
		title: 'Spear',
		description: '',
		type: Types.TWO_HANDED,
		wield: [Wield.BOTH]
	},
	SWORD_2H: {
		title: '2H Sword',
		description: '',
		type: Types.TWO_HANDED,
		wield: [Wield.BOTH]
	},
	AXE_2H: {
		title: '2H Axe',
		description: '',
		type: Types.TWO_HANDED,
		wield: [Wield.BOTH]
	},
	HAMMER_2H: {
		title: '2H Hammer',
		description: '',
		type: Types.TWO_HANDED,
		wield: [Wield.BOTH]
	},
	MACE: {
		title: 'Mace',
		description: '',
		type: Types.MAGICAL,
		wield: [Wield.MAIN]
	},
	STAFF: {
		title: 'Staff',
		description: '',
		type: Types.MAGICAL,
		wield: [Wield.BOTH]
	},
	BOW: {
		title: 'Bow',
		description: '',
		type: Types.RANGED,
		wield: [Wield.BOTH]
	},
	GUN_1H: {
		title: '1H Gun',
		description: '',
		type: Types.RANGED,
		wield: [Wield.MAIN, Wield.OFF]
	},
	GUN_2H: {
		title: '2H Gun',
		description: '',
		type: Types.RANGED,
		wield: [Wield.BOTH]
	},
	SHIELD_SMALL: {
		title: 'Small Shield',
		description: '',
		type: Types.SHIELD,
		wield: [Wield.OFF]
	},
	SHIELD_LARGE: {
		title: 'Large Shield',
		description: '',
		type: Types.SHIELD,
		wield: [Wield.OFF]
	}
};
