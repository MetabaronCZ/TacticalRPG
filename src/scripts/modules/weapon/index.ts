import WeaponList from 'modules/weapon/list';
import { WeaponID, WeaponTypeID } from 'modules/weapon/types';
import { WeaponSkillID as SKillID } from 'modules/skill/weapon/types';

const Weapons = new WeaponList({
	[WeaponID.NONE]: {
		title: 'none',
		description: 'No weapon equipped',
		type: WeaponTypeID.NONE,
		skills: [],
		damage: 1,
		magic: 0
	},
	[WeaponID.FISTS]: {
		title: 'Fists',
		description: '',
		type: WeaponTypeID.DUAL,
		skills: [SKillID.FISTS_ATTACK, SKillID.FISTS_DISARM],
		damage: 5,
		magic: 0
	},
	[WeaponID.DAGGER]: {
		title: 'Dagger',
		description: '',
		type: WeaponTypeID.ONE_HANDED,
		skills: [SKillID.DAGGER_ATTACK, SKillID.DAGGER_STAB],
		damage: 5,
		magic: 0
	},
	[WeaponID.SWORD_1H]: {
		title: '1H Sword',
		description: '',
		type: WeaponTypeID.ONE_HANDED,
		skills: [SKillID.SWORD_1H_ATTACK, SKillID.SWORD_1H_BLEED],
		damage: 10,
		magic: 0
	},
	[WeaponID.AXE_1H]: {
		title: '1H Axe',
		description: '',
		type: WeaponTypeID.ONE_HANDED,
		skills: [SKillID.AXE_1H_ATTACK, SKillID.AXE_1H_SMASH],
		damage: 10,
		magic: 0
	},
	[WeaponID.HAMMER_1H]: {
		title: '1H Hammer',
		description: '',
		type: WeaponTypeID.ONE_HANDED,
		skills: [SKillID.HAMMER_1H_ATTACK, SKillID.HAMMER_1H_STUN],
		damage: 10,
		magic: 0
	},
	[WeaponID.SPEAR]: {
		title: 'Spear',
		description: '',
		type: WeaponTypeID.TWO_HANDED,
		skills: [SKillID.SPEAR_ATTACK, SKillID.SPEAR_THRUST],
		damage: 20,
		magic: 0
	},
	[WeaponID.SWORD_2H]: {
		title: '2H Sword',
		description: '',
		type: WeaponTypeID.TWO_HANDED,
		skills: [SKillID.SWORD_2H_ATTACK, SKillID.SWORD_2H_CLEAVE],
		damage: 20,
		magic: 0
	},
	[WeaponID.AXE_2H]: {
		title: '2H Axe',
		description: '',
		type: WeaponTypeID.TWO_HANDED,
		skills: [SKillID.AXE_2H_ATTACK, SKillID.AXE_2H_WHIRLWIND],
		damage: 20,
		magic: 0
	},
	[WeaponID.HAMMER_2H]: {
		title: '2H Hammer',
		description: '',
		type: WeaponTypeID.TWO_HANDED,
		skills: [SKillID.HAMMER_2H_ATTACK, SKillID.HAMMER_2H_SHOCKWAVE],
		damage: 20,
		magic: 0
	},
	[WeaponID.MACE]: {
		title: 'Mace',
		description: '',
		type: WeaponTypeID.MAGICAL,
		skills: [SKillID.MACE_ATTACK],
		damage: 1,
		magic: 50
	},
	[WeaponID.STAFF]: {
		title: 'Staff',
		description: '',
		type: WeaponTypeID.MAGICAL,
		skills: [SKillID.STAFF_ATTACK],
		damage: 5,
		magic: 100
	},
	[WeaponID.BOW]: {
		title: 'Bow',
		description: '',
		type: WeaponTypeID.RANGED,
		skills: [SKillID.BOW_ATTACK, SKillID.BOW_CHARGE],
		damage: 20,
		magic: 0
	},
	[WeaponID.GUN_1H]: {
		title: '1H Gun',
		description: '',
		type: WeaponTypeID.RANGED,
		skills: [SKillID.GUN_1H_ATTACK, SKillID.GUN_1H_CRIPPLE],
		damage: 1,
		magic: 0
	},
	[WeaponID.GUN_2H]: {
		title: '2H Gun',
		description: '',
		type: WeaponTypeID.RANGED,
		skills: [SKillID.GUN_2H_ATTACK, SKillID.GUN_2H_PIERCE],
		damage: 1,
		magic: 0
	},
	[WeaponID.SHIELD_SMALL]: {
		title: 'Small Shield',
		description: '',
		type: WeaponTypeID.SHIELD,
		skills: [SKillID.SHIELD_SMALL_BLOCK],
		damage: 1,
		magic: 0
	},
	[WeaponID.SHIELD_LARGE]: {
		title: 'Large Shield',
		description: '',
		type: WeaponTypeID.SHIELD,
		skills: [SKillID.SHIELD_LARGE_BLOCK],
		damage: 1,
		magic: 0
	}
});

export default Weapons;
