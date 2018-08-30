export enum StatusEffectID {
	CRIPPLE = 'CRIPPLE',
	DISARM = 'DISARM',
	BLEED = 'BLEED',
	STUN = 'STUN',

	BURN = 'BURN',
	SHOCK = 'SHOCK',
	FREEZE = 'FREEZE',
	FORGET = 'FORGET',
	SILENCE = 'SILENCE',

	REGEN = 'REGEN',
	IRON_SKIN = 'IRON_SKIN',
	BLOCK_SMALL = 'BLOCK_SMALL',
	BLOCK_LARGE = 'BLOCK_LARGE'
}

export enum StatusEffectType {
	PHYSICAL = 'PHYSICAL',
	MAGICAL = 'MAGICAL',
	SUPPORT = 'SUPPORT'
}

export interface IStatusEffect {
	id: StatusEffectID;
	type: StatusEffectType;
	title: string;
	duration: number; // in game ticks
}
