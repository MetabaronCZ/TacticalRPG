import StatusEffects from 'data/status-effects';

import Character from 'modules/character';
import { IOnBattleInfo } from 'modules/battle/battle-info';

type StatusEffectApplyFun = (
	tgt: Character,
	phy: number,
	mag: number,
	onStatus: IOnStatus,
	onInfo: IOnBattleInfo
) => void;

export type IOnStatus = (value: number, condition?: boolean) => void;

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
	private readonly physical: number;
	private readonly magical: number;
	private readonly onStatus: IOnStatus;
	private readonly applyFun?: StatusEffectApplyFun;

	constructor(id: StatusEffectID, physical = 0, magical = 0, onStatus?: IOnStatus) {
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
		this.onStatus = (onStatus ? onStatus : () => void(0));
		this.physical = physical;
		this.magical = magical;
		this.applyFun = data.apply;
	}

	public apply(target: Character, onInfo: IOnBattleInfo) {
		const { physical, magical, applyFun, onStatus } = this;

		if (applyFun) {
			applyFun(target, physical, magical, onStatus, onInfo);
		}
	}
}

export default StatusEffect;
