import * as Skills from 'data/skills';

export default {
	BAR: {
		title: 'Barbarian',
		description: 'A warrior with extreme strength',
		archetype: ['PP'],
		skills: [Skills.BERSERKING]
	},
	KNG: {
		title: 'Knight',
		description: 'A warrior with high endurance',
		archetype: ['PP'],
		skills: [Skills.NONE]
	},
	DRG: {
		title: 'Dragonkin',
		description: '???',
		archetype: ['PP'],
		skills: [Skills.NONE]
	},
	CYB: {
		title: 'Cyborg',
		description: '???',
		archetype: ['PP'],
		skills: [Skills.PROGRAM]
	},
	WAR: {
		title: 'Warrior',
		description: 'A master of weapons',
		archetype: ['PS', 'SP'],
		skills: [Skills.NONE]
	},
	BRW: {
		title: 'Brawler',
		description: '???',
		archetype: ['PS', 'SP'],
		skills: [Skills.NONE]
	},
	HUN: {
		title: 'Hunter',
		description: '???',
		archetype: ['PS', 'SP'],
		skills: [Skills.NONE]
	},
	WER: {
		title: 'Werewolf',
		description: 'A feral warrior',
		archetype: ['PS', 'SP'],
		skills: [Skills.LYCANTROPHY]
	},
	BLD: {
		title: 'Blademaster',
		description: '???',
		archetype: ['PM', 'MP'],
		skills: [Skills.NONE]
	},
	PAL: {
		title: 'Paladin',
		description: 'A holy guardian',
		archetype: ['PM', 'MP'],
		skills: [Skills.NONE]
	},
	DRK: {
		title: 'Dark Knight',
		description: 'A knight of darkness',
		archetype: ['PM', 'MP'],
		skills: [Skills.NONE]
	},
	SPL: {
		title: 'Spellblade',
		description: '???',
		archetype: ['PM', 'MP'],
		skills: [Skills.NONE]
	},
	ROG: {
		title: 'Rogue',
		description: '???',
		archetype: ['SS'],
		skills: [Skills.NONE]
	},
	RAN: {
		title: 'Ranger',
		description: 'A ranged weapon specialist',
		archetype: ['SS'],
		skills: [Skills.NONE]
	},
	ENT: {
		title: 'Entertainer',
		description: '???',
		archetype: ['SS'],
		skills: [Skills.DANCING, Skills.SINGING]
	},
	VMP: {
		title: 'Vampire',
		description: '???',
		archetype: ['SS'],
		skills: [Skills.NONE]
	},
	TRI: {
		title: 'Trickster',
		description: '???',
		archetype: ['SM', 'MS'],
		skills: [Skills.NONE]
	},
	MNK: {
		title: 'Monk',
		description: '???',
		archetype: ['SM', 'MS'],
		skills: [Skills.NONE]
	},
	ASA: {
		title: 'Assassin',
		description: 'A fighter of shadows',
		archetype: ['SM', 'MS'],
		skills: [Skills.NONE]
	},
	ALC: {
		title: 'Alchemist',
		description: '???',
		archetype: ['SM', 'MS'],
		skills: [Skills.NONE]
	},
	PSY: {
		title: 'Psyker',
		description: 'A fighter with strong mental abilites',
		archetype: ['MM'],
		skills: [Skills.MAGIC_KINETIC]
	},
	PRI: {
		title: 'Priest',
		description: 'A holy magician',
		archetype: ['MM'],
		skills: [Skills.MAGIC_HOLY]
	},
	SOR: {
		title: 'Sorcerer',
		description: 'A dark magician',
		archetype: ['MM'],
		skills: [Skills.MAGIC_DARK]
	},
	ELM: {
		title: 'Elemental Mage',
		description: 'A master of elemental magic',
		archetype: ['MM'],
		skills: [Skills.MAGIC_FIRE, Skills.MAGIC_WATER, Skills.MAGIC_AIR, Skills.MAGIC_EARTH]
	}
};
