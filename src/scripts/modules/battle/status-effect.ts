import Character from 'modules/character';
import { IOnBattleInfo } from 'modules/battle/battle-info';

export type StatusEffectID =
	'CRIPPLE' | 'DISARM' | 'BLEED' | 'STUN' | 'DYING' |
	'BURN' | 'SHOCK' | 'FREEZE' | 'CONFUSION' | 'SILENCE' |
	'REGEN' | 'IRON_SKIN' | 'BERSERK' | 'BLOCK_SMALL' | 'BLOCK_LARGE' | 'ENERGY_SHIELD';

export type StatusEffectType = 'PHYSICAL' | 'MAGICAL' | 'SUPPORT';
export type StatusEffectDuration = 0 | 33 | 100;  // game ticks
export type StatusEffectRepeat = 0 | 3;

export interface IStatusEffect {
	readonly id: StatusEffectID;
	readonly type: StatusEffectType;
	readonly title: string;
	readonly effect: string;
	readonly multi: 'RENEW' | 'STACK' | 'IGNORE';
	readonly description?: string;
	readonly duration: {
		value: number;
		readonly max: StatusEffectDuration;
	};
	readonly repeat: {
		value: number;
		readonly max: StatusEffectRepeat;
	};
	apply?: (character: Character, cb: IOnBattleInfo) => void;
}
