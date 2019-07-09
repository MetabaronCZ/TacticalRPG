import StatusEffects from 'data/status-effects';

import Character from 'modules/character';
import { IOnBattleInfo } from 'modules/battle/battle-info';

type StatusEffectApplyFun = (
	src: Character,
	tgt: Character,
	phy: number,
	mag: number,
	cb: IOnBattleInfo
) => void;

export type StatusEffectID =
	'CRIPPLE' | 'DISARM' | 'BLEED' | 'STUN' | 'DYING' |
	'BURN' | 'SHOCK' | 'FREEZE' | 'CONFUSION' | 'SILENCE' |
	'REGEN' | 'IRON_SKIN' | 'BERSERK' | 'BLOCK_SMALL' | 'BLOCK_LARGE' | 'ENERGY_SHIELD';

export type StatusEffectType = 'PHYSICAL' | 'MAGICAL' | 'SUPPORT';
export type StatusEffectMulti = 'RENEW' | 'STACK' | 'IGNORE';
export type StatusEffectDuration = 0 | 33 | 100;  // game ticks
export type StatusEffectRepeat = 0 | 3;

export interface IStatusEffect {
	readonly type: StatusEffectType;
	readonly title: string;
	readonly effect: string;
	readonly multi: 'RENEW' | 'STACK' | 'IGNORE';
	readonly description: string;
	readonly duration?: StatusEffectDuration;
	readonly repeat?: StatusEffectRepeat;
	apply?: StatusEffectApplyFun;
}

class StatusEffect {
	public readonly id: StatusEffectID;
	public readonly type: StatusEffectType;
	public readonly title: string;
	public readonly effect: string;
	public readonly multi: StatusEffectMulti;
	public readonly description: string;
	public readonly duration: {
		value: number;
		readonly max: StatusEffectDuration;
	};
	public readonly repeat: {
		value: number;
		readonly max: StatusEffectRepeat;
	};
	private readonly caster: Character;
	private readonly physical: number;
	private readonly magical: number;
	private readonly applyFun?: StatusEffectApplyFun;

	constructor(id: StatusEffectID, caster: Character, physical = 0, magical = 0) {
		const data = StatusEffects.get(id);
		this.id = id;
		this.type = data.type;
		this.title = data.title;
		this.effect = data.effect;
		this.multi = data.multi;
		this.description = data.description;
		this.duration = {
			value: data.duration || 0,
			max: data.duration || 0
		};
		this.repeat = {
			value: data.repeat || 0,
			max: data.repeat || 0
		};
		this.caster = caster;
		this.physical = physical;
		this.magical = magical;
		this.applyFun = data.apply;
	}

	public apply(target: Character, cb: IOnBattleInfo) {
		const { caster, physical, magical, applyFun } = this;

		if (applyFun) {
			applyFun(caster, target, physical, magical, cb);
		}
	}
}

export default StatusEffect;
