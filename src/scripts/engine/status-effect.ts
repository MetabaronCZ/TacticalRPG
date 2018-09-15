export type StatusEffectID =
	'CRIPPLE' | 'DISARM' | 'BLEED' | 'STUN' |
	'BURN' | 'SHOCK' | 'FREEZE' | 'FORGET' | 'SILENCE' |
	'REGEN' | 'IRON_SKIN' | 'BLOCK_SMALL' | 'BLOCK_LARGE';

export type StatusEffectType = 'PHYSICAL' | 'MAGICAL' | 'SUPPORT';

export interface IStatusEffect {
	id: StatusEffectID;
	type: StatusEffectType;
	title: string;
	duration: number; // in game ticks
}
