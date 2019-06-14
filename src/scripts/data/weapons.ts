import DataList from 'core/data-list';
import { WeaponID, IWeaponData } from 'modules/equipment/weapon-data';

const Weapons = new DataList<WeaponID, IWeaponData>({
	NONE: {
		id: 'NONE',
		title: 'none',
		description: 'No weapon equipped',
		type: 'NONE',
		skills: [],
		physical: 0,
		magical: 0
	},
	FISTS: {
		id: 'FISTS',
		title: 'Fists',
		description: '',
		type: 'DUAL',
		skills: ['FST_ATTACK', 'FST_DISARM'],
		physical: 10,
		magical: 0
	},
	DAGGER: {
		id: 'DAGGER',
		title: 'Dagger',
		description: '',
		type: 'ONE_HANDED',
		skills: ['DGR_ATTACK', 'DGR_STAB'],
		physical: 10,
		magical: 0
	},
	SWORD_1H: {
		id: 'SWORD_1H',
		title: '1H Sword',
		description: '',
		type: 'ONE_HANDED',
		skills: ['S1H_ATTACK', 'S1H_BLEED'],
		physical: 20,
		magical: 0
	},
	AXE_1H: {
		id: 'AXE_1H',
		title: '1H Axe',
		description: '',
		type: 'ONE_HANDED',
		skills: ['A1H_ATTACK', 'A1H_SMASH'],
		physical: 20,
		magical: 0
	},
	HAMMER_1H: {
		id: 'HAMMER_1H',
		title: '1H Hammer',
		description: '',
		type: 'ONE_HANDED',
		skills: ['H1H_ATTACK', 'H1H_STUN'],
		physical: 20,
		magical: 0
	},
	SPEAR: {
		id: 'SPEAR',
		title: 'Spear',
		description: '',
		type: 'TWO_HANDED',
		skills: ['SPR_ATTACK', 'SPR_THRUST'],
		physical: 30,
		magical: 0
	},
	SWORD_2H: {
		id: 'SWORD_2H',
		title: '2H Sword',
		description: '',
		type: 'TWO_HANDED',
		skills: ['S2H_ATTACK', 'S2H_CLEAVE'],
		physical: 30,
		magical: 0
	},
	AXE_2H: {
		id: 'AXE_2H',
		title: '2H Axe',
		description: '',
		type: 'TWO_HANDED',
		skills: ['A2H_ATTACK', 'A2H_WHIRLWIND'],
		physical: 30,
		magical: 0
	},
	HAMMER_2H: {
		id: 'HAMMER_2H',
		title: '2H Hammer',
		description: '',
		type: 'TWO_HANDED',
		skills: ['H2H_ATTACK', 'H2H_SHOCKWAVE'],
		physical: 30,
		magical: 0
	},
	ROD: {
		id: 'ROD',
		title: 'Rod',
		description: '',
		type: 'MAGICAL',
		skills: [],
		physical: 0,
		magical: 20
	},
	STAFF: {
		id: 'STAFF',
		title: 'Staff',
		description: '',
		type: 'MAGICAL',
		skills: [],
		physical: 0,
		magical: 30
	},
	BOW: {
		id: 'BOW',
		title: 'Bow',
		description: '',
		type: 'RANGED',
		skills: ['BOW_ATTACK', 'BOW_CHARGE'],
		physical: 20,
		magical: 0
	},
	GUN: {
		id: 'GUN',
		title: 'Gun',
		description: '',
		type: 'RANGED',
		skills: ['GUN_ATTACK', 'GUN_CRIPPLE'],
		physical: 20,
		magical: 0
	},
	SHIELD_SMALL: {
		id: 'SHIELD_SMALL',
		title: 'Small Shield',
		description: '',
		type: 'SHIELD',
		skills: ['SHD_SMALL_BLOCK'],
		physical: 0,
		magical: 0,
		block: 10
	},
	SHIELD_LARGE: {
		id: 'SHIELD_LARGE',
		title: 'Large Shield',
		description: '',
		type: 'SHIELD',
		skills: ['SHD_LARGE_BLOCK'],
		physical: 0,
		magical: 0,
		block: 30
	}
});

export default Weapons;
