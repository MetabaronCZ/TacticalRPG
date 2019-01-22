import DataList from 'core/data-list';
import { WeaponID, IWeaponData } from 'modules/equipment/weapon-data';

const Weapons = new DataList<WeaponID, IWeaponData>({
	NONE: {
		id: 'NONE',
		title: 'none',
		description: 'No weapon equipped',
		type: 'NONE',
		skills: [],
		damage: 1,
		magic: 0
	},
	FISTS: {
		id: 'FISTS',
		title: 'Fists',
		description: '',
		type: 'DUAL',
		skills: ['FST_ATTACK', 'FST_DISARM'],
		damage: 5,
		magic: 0
	},
	DAGGER: {
		id: 'DAGGER',
		title: 'Dagger',
		description: '',
		type: 'ONE_HANDED',
		skills: ['DGR_ATTACK', 'DGR_STAB'],
		damage: 5,
		magic: 0
	},
	SWORD_1H: {
		id: 'SWORD_1H',
		title: '1H Sword',
		description: '',
		type: 'ONE_HANDED',
		skills: ['S1H_ATTACK', 'S1H_BLEED'],
		damage: 10,
		magic: 0
	},
	AXE_1H: {
		id: 'AXE_1H',
		title: '1H Axe',
		description: '',
		type: 'ONE_HANDED',
		skills: ['A1H_ATTACK', 'A1H_SMASH'],
		damage: 10,
		magic: 0
	},
	HAMMER_1H: {
		id: 'HAMMER_1H',
		title: '1H Hammer',
		description: '',
		type: 'ONE_HANDED',
		skills: ['H1H_ATTACK', 'H1H_STUN'],
		damage: 10,
		magic: 0
	},
	SPEAR: {
		id: 'SPEAR',
		title: 'Spear',
		description: '',
		type: 'TWO_HANDED',
		skills: ['SPR_ATTACK', 'SPR_THRUST'],
		damage: 20,
		magic: 0
	},
	SWORD_2H: {
		id: 'SWORD_2H',
		title: '2H Sword',
		description: '',
		type: 'TWO_HANDED',
		skills: ['S2H_ATTACK', 'S2H_CLEAVE'],
		damage: 20,
		magic: 0
	},
	AXE_2H: {
		id: 'AXE_2H',
		title: '2H Axe',
		description: '',
		type: 'TWO_HANDED',
		skills: ['A2H_ATTACK', 'A2H_WHIRLWIND'],
		damage: 20,
		magic: 0
	},
	HAMMER_2H: {
		id: 'HAMMER_2H',
		title: '2H Hammer',
		description: '',
		type: 'TWO_HANDED',
		skills: ['H2H_ATTACK', 'H2H_SHOCKWAVE'],
		damage: 20,
		magic: 0
	},
	MACE: {
		id: 'MACE',
		title: 'Mace',
		description: '',
		type: 'MAGICAL',
		skills: ['MCE_ATTACK'],
		damage: 1,
		magic: 10
	},
	STAFF: {
		id: 'STAFF',
		title: 'Staff',
		description: '',
		type: 'MAGICAL',
		skills: ['STF_ATTACK'],
		damage: 5,
		magic: 20
	},
	BOW: {
		id: 'BOW',
		title: 'Bow',
		description: '',
		type: 'RANGED',
		skills: ['BOW_ATTACK', 'BOW_CHARGE'],
		damage: 20,
		magic: 0
	},
	GUN_1H: {
		id: 'GUN_1H',
		title: '1H Gun',
		description: '',
		type: 'RANGED',
		skills: ['G1H_ATTACK', 'G1H_CRIPPLE'],
		damage: 1,
		magic: 0
	},
	GUN_2H: {
		id: 'GUN_2H',
		title: '2H Gun',
		description: '',
		type: 'RANGED',
		skills: ['G2H_ATTACK', 'G2H_PIERCE'],
		damage: 1,
		magic: 0
	},
	SHIELD_SMALL: {
		id: 'SHIELD_SMALL',
		title: 'Small Shield',
		description: '',
		type: 'SHIELD',
		skills: ['SHD_SMALL_BLOCK'],
		damage: 1,
		magic: 0
	},
	SHIELD_LARGE: {
		id: 'SHIELD_LARGE',
		title: 'Large Shield',
		description: '',
		type: 'SHIELD',
		skills: ['SHD_LARGE_BLOCK'],
		damage: 1,
		magic: 0
	}
});

export default Weapons;
