export enum SkillType {
	ACTIVE = 'ACTIVE',
	REACTIVE = 'REACTIVE',
	PASSIVE = 'PASSIVE'
}

export enum SkillRange {
	R0 = 0,
	R1 = 1,
	R2 = 2,
	R4 = 4
}

export enum SkillArea {
	SINGLE = 'SINGLE',
	LINE = 'LINE',
	CROSS = 'CROSS',
	AOE3x3 = 'AOE3x3',
	NEIGHBOURS = 'NEIGHBOURS'
}

export enum SkillElement {
	NONE = 'NONE',
	FIRE = 'FIRE',
	ICE = 'ICE',
	WIND = 'WIND',
	EARTH = 'EARTH',
	THUNDER = 'THUNDER',
	WATER = 'WATER',
	DARK = 'DARK',
	HOLY = 'HOLY',
	PSYCHIC = 'PSYCHIC'
}

export enum SkillStatus {
	CRIPPLE = 'CRIPPLE',
	DISARM = 'DISARM',
	BLEED = 'BLEED',
	STUN = 'STUN',
	BURN = 'BURN',
	SHOCK = 'SHOCK',
	FREEZE = 'FREEZE',
	FORGET = 'FORGET',
	SILENCE = 'SILENCE',

	FLOAT = 'FLOAT',
	REGEN = 'REGEN',
	BERSERK = 'BERSERK',
	IRON_SKIN = 'IRON_SKIN',
	ULTIMATE_DEFENSE = 'ULTIMATE_DEFENSE'
}

export enum SkillTarget {
	NONE = 'NONE',
	ANY = 'ANY',
	SELF = 'SELF',
	ALLY = 'ALLY',
	ENEMY = 'ENEMY',
}
