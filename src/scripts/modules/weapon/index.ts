import WeaponList from 'modules/weapon/list';
import { WeaponID, WeaponTypeID } from 'modules/weapon/types';
import { WeaponSkillID as SKillID } from 'modules/skill/weapon/types';

const Weapons = new WeaponList({
	[WeaponID.NONE]: {
		title: 'none',
		description: 'No weapon equipped',
		type: WeaponTypeID.NONE,
		skills: []
	},
	[WeaponID.FISTS]: {
		title: 'Fists',
		description: '',
		type: WeaponTypeID.DUAL,
		skills: [SKillID.FISTS_ATTACK, SKillID.FISTS_DISARM]
	},
	[WeaponID.DAGGER]: {
		title: 'Dagger',
		description: '',
		type: WeaponTypeID.ONE_HANDED,
		skills: [SKillID.DAGGER_ATTACK, SKillID.DAGGER_STAB]
	},
	[WeaponID.SWORD_1H]: {
		title: '1H Sword',
		description: '',
		type: WeaponTypeID.ONE_HANDED,
		skills: [SKillID.SWORD_1H_ATTACK, SKillID.SWORD_1H_BLEED]
	},
	[WeaponID.AXE_1H]: {
		title: '1H Axe',
		description: '',
		type: WeaponTypeID.ONE_HANDED,
		skills: [SKillID.AXE_1H_ATTACK, SKillID.AXE_1H_SMASH]
	},
	[WeaponID.HAMMER_1H]: {
		title: '1H Hammer',
		description: '',
		type: WeaponTypeID.ONE_HANDED,
		skills: [SKillID.HAMMER_1H_ATTACK, SKillID.HAMMER_1H_STUN]
	},
	[WeaponID.SPEAR]: {
		title: 'Spear',
		description: '',
		type: WeaponTypeID.TWO_HANDED,
		skills: [SKillID.SPEAR_ATTACK, SKillID.SPEAR_THRUST]
	},
	[WeaponID.SWORD_2H]: {
		title: '2H Sword',
		description: '',
		type: WeaponTypeID.TWO_HANDED,
		skills: [SKillID.SWORD_2H_ATTACK, SKillID.SWORD_2H_CLEAVE]
	},
	[WeaponID.AXE_2H]: {
		title: '2H Axe',
		description: '',
		type: WeaponTypeID.TWO_HANDED,
		skills: [SKillID.AXE_2H_ATTACK, SKillID.AXE_2H_WHIRLWIND]
	},
	[WeaponID.HAMMER_2H]: {
		title: '2H Hammer',
		description: '',
		type: WeaponTypeID.TWO_HANDED,
		skills: [SKillID.HAMMER_2H_ATTACK, SKillID.HAMMER_2H_SHOCKWAVE]
	},
	[WeaponID.MACE]: {
		title: 'Mace',
		description: '',
		type: WeaponTypeID.MAGICAL,
		skills: [SKillID.MACE_ATTACK]
	},
	[WeaponID.STAFF]: {
		title: 'Staff',
		description: '',
		type: WeaponTypeID.MAGICAL,
		skills: [SKillID.STAFF_ATTACK]
	},
	[WeaponID.BOW]: {
		title: 'Bow',
		description: '',
		type: WeaponTypeID.RANGED,
		skills: [SKillID.BOW_ATTACK, SKillID.BOW_CHARGE]
	},
	[WeaponID.GUN_1H]: {
		title: '1H Gun',
		description: '',
		type: WeaponTypeID.RANGED,
		skills: [SKillID.GUN_1H_ATTACK, SKillID.GUN_1H_CRIPPLE]
	},
	[WeaponID.GUN_2H]: {
		title: '2H Gun',
		description: '',
		type: WeaponTypeID.RANGED,
		skills: [SKillID.GUN_2H_ATTACK, SKillID.GUN_2H_PIERCE]
	},
	[WeaponID.SHIELD_SMALL]: {
		title: 'Small Shield',
		description: '',
		type: WeaponTypeID.SHIELD,
		skills: [SKillID.SHIELD_SMALL_BLOCK]
	},
	[WeaponID.SHIELD_LARGE]: {
		title: 'Large Shield',
		description: '',
		type: WeaponTypeID.SHIELD,
		skills: [SKillID.SHIELD_LARGE_BLOCK]
	}
});

export default Weapons;
