import DataList from 'core/data-list';
import { WeaponID, IWeaponData } from 'engine/equipment/weapon-data';

const Weapons = new DataList<WeaponID, IWeaponData>({
	NONE: {
		title: 'none',
		description: 'No weapon equipped',
		type: 'NONE',
		skills: [],
		damage: 1,
		magic: 0
	},
	FISTS: {
		title: 'Fists',
		description: '',
		type: 'DUAL',
		skills: ['FISTS_ATTACK', 'FISTS_DISARM'],
		damage: 5,
		magic: 0
	},
	DAGGER: {
		title: 'Dagger',
		description: '',
		type: 'ONE_HANDED',
		skills: ['DAGGER_ATTACK', 'DAGGER_STAB'],
		damage: 5,
		magic: 0
	},
	SWORD_1H: {
		title: '1H Sword',
		description: '',
		type: 'ONE_HANDED',
		skills: ['SWORD_1H_ATTACK', 'SWORD_1H_BLEED'],
		damage: 10,
		magic: 0
	},
	AXE_1H: {
		title: '1H Axe',
		description: '',
		type: 'ONE_HANDED',
		skills: ['AXE_1H_ATTACK', 'AXE_1H_SMASH'],
		damage: 10,
		magic: 0
	},
	HAMMER_1H: {
		title: '1H Hammer',
		description: '',
		type: 'ONE_HANDED',
		skills: ['HAMMER_1H_ATTACK', 'HAMMER_1H_STUN'],
		damage: 10,
		magic: 0
	},
	SPEAR: {
		title: 'Spear',
		description: '',
		type: 'TWO_HANDED',
		skills: ['SPEAR_ATTACK', 'SPEAR_THRUST'],
		damage: 20,
		magic: 0
	},
	SWORD_2H: {
		title: '2H Sword',
		description: '',
		type: 'TWO_HANDED',
		skills: ['SWORD_2H_ATTACK', 'SWORD_2H_CLEAVE'],
		damage: 20,
		magic: 0
	},
	AXE_2H: {
		title: '2H Axe',
		description: '',
		type: 'TWO_HANDED',
		skills: ['AXE_2H_ATTACK', 'AXE_2H_WHIRLWIND'],
		damage: 20,
		magic: 0
	},
	HAMMER_2H: {
		title: '2H Hammer',
		description: '',
		type: 'TWO_HANDED',
		skills: ['HAMMER_2H_ATTACK', 'HAMMER_2H_SHOCKWAVE'],
		damage: 20,
		magic: 0
	},
	MACE: {
		title: 'Mace',
		description: '',
		type: 'MAGICAL',
		skills: ['MACE_ATTACK'],
		damage: 1,
		magic: 50
	},
	STAFF: {
		title: 'Staff',
		description: '',
		type: 'MAGICAL',
		skills: ['STAFF_ATTACK'],
		damage: 5,
		magic: 100
	},
	BOW: {
		title: 'Bow',
		description: '',
		type: 'RANGED',
		skills: ['BOW_ATTACK', 'BOW_CHARGE'],
		damage: 20,
		magic: 0
	},
	GUN_1H: {
		title: '1H Gun',
		description: '',
		type: 'RANGED',
		skills: ['GUN_1H_ATTACK', 'GUN_1H_CRIPPLE'],
		damage: 1,
		magic: 0
	},
	GUN_2H: {
		title: '2H Gun',
		description: '',
		type: 'RANGED',
		skills: ['GUN_2H_ATTACK', 'GUN_2H_PIERCE'],
		damage: 1,
		magic: 0
	},
	SHIELD_SMALL: {
		title: 'Small Shield',
		description: '',
		type: 'SHIELD',
		skills: ['SHIELD_SMALL_BLOCK'],
		damage: 1,
		magic: 0
	},
	SHIELD_LARGE: {
		title: 'Large Shield',
		description: '',
		type: 'SHIELD',
		skills: ['SHIELD_LARGE_BLOCK'],
		damage: 1,
		magic: 0
	}
});

export default Weapons;
