import { WeaponList } from 'engine/weapon-data';
import { WeaponSkillID as SKillID } from 'modules/skill/weapon/types';

const Weapons = new WeaponList({
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
		skills: [SKillID.FISTS_ATTACK, SKillID.FISTS_DISARM],
		damage: 5,
		magic: 0
	},
	DAGGER: {
		title: 'Dagger',
		description: '',
		type: 'ONE_HANDED',
		skills: [SKillID.DAGGER_ATTACK, SKillID.DAGGER_STAB],
		damage: 5,
		magic: 0
	},
	SWORD_1H: {
		title: '1H Sword',
		description: '',
		type: 'ONE_HANDED',
		skills: [SKillID.SWORD_1H_ATTACK, SKillID.SWORD_1H_BLEED],
		damage: 10,
		magic: 0
	},
	AXE_1H: {
		title: '1H Axe',
		description: '',
		type: 'ONE_HANDED',
		skills: [SKillID.AXE_1H_ATTACK, SKillID.AXE_1H_SMASH],
		damage: 10,
		magic: 0
	},
	HAMMER_1H: {
		title: '1H Hammer',
		description: '',
		type: 'ONE_HANDED',
		skills: [SKillID.HAMMER_1H_ATTACK, SKillID.HAMMER_1H_STUN],
		damage: 10,
		magic: 0
	},
	SPEAR: {
		title: 'Spear',
		description: '',
		type: 'TWO_HANDED',
		skills: [SKillID.SPEAR_ATTACK, SKillID.SPEAR_THRUST],
		damage: 20,
		magic: 0
	},
	SWORD_2H: {
		title: '2H Sword',
		description: '',
		type: 'TWO_HANDED',
		skills: [SKillID.SWORD_2H_ATTACK, SKillID.SWORD_2H_CLEAVE],
		damage: 20,
		magic: 0
	},
	AXE_2H: {
		title: '2H Axe',
		description: '',
		type: 'TWO_HANDED',
		skills: [SKillID.AXE_2H_ATTACK, SKillID.AXE_2H_WHIRLWIND],
		damage: 20,
		magic: 0
	},
	HAMMER_2H: {
		title: '2H Hammer',
		description: '',
		type: 'TWO_HANDED',
		skills: [SKillID.HAMMER_2H_ATTACK, SKillID.HAMMER_2H_SHOCKWAVE],
		damage: 20,
		magic: 0
	},
	MACE: {
		title: 'Mace',
		description: '',
		type: 'MAGICAL',
		skills: [SKillID.MACE_ATTACK],
		damage: 1,
		magic: 50
	},
	STAFF: {
		title: 'Staff',
		description: '',
		type: 'MAGICAL',
		skills: [SKillID.STAFF_ATTACK],
		damage: 5,
		magic: 100
	},
	BOW: {
		title: 'Bow',
		description: '',
		type: 'RANGED',
		skills: [SKillID.BOW_ATTACK, SKillID.BOW_CHARGE],
		damage: 20,
		magic: 0
	},
	GUN_1H: {
		title: '1H Gun',
		description: '',
		type: 'RANGED',
		skills: [SKillID.GUN_1H_ATTACK, SKillID.GUN_1H_CRIPPLE],
		damage: 1,
		magic: 0
	},
	GUN_2H: {
		title: '2H Gun',
		description: '',
		type: 'RANGED',
		skills: [SKillID.GUN_2H_ATTACK, SKillID.GUN_2H_PIERCE],
		damage: 1,
		magic: 0
	},
	SHIELD_SMALL: {
		title: 'Small Shield',
		description: '',
		type: 'SHIELD',
		skills: [SKillID.SHIELD_SMALL_BLOCK],
		damage: 1,
		magic: 0
	},
	SHIELD_LARGE: {
		title: 'Large Shield',
		description: '',
		type: 'SHIELD',
		skills: [SKillID.SHIELD_LARGE_BLOCK],
		damage: 1,
		magic: 0
	}
});

export default Weapons;
