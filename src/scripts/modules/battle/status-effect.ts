import Character from 'modules/character';
import { IOnBattleInfo } from 'modules/battle/battle-info';

export type StatusEffectID =
	'CRIPPLE' | 'DISARM' | 'BLEED' | 'STUN' |
	'BURN' | 'SHOCK' | 'FREEZE' | 'CONFUSION' | 'SILENCE' |
	'REGEN' | 'IRON_SKIN' | 'BLOCK_SMALL' | 'BLOCK_LARGE';

export type StatusEffectType = 'PHYSICAL' | 'MAGICAL' | 'SUPPORT';
export type StatusEffectDuration = 0 | 33 | 100;  // game ticks
export type StatusEffectRepeat = 0 | 3;

export interface IStatusEffect {
	id: StatusEffectID;
	type: StatusEffectType;
	title: string;
	effect: string;
	description?: string;
	duration?: StatusEffectDuration;
	repeat?: StatusEffectRepeat;
	apply?: (character: Character, cb: IOnBattleInfo) => void;
}
