import DataList from 'core/data-list';
import { smallShieldBlock } from 'data/game-config';
import { StatusEffectID, IStatusEffect, StatusEffectType } from 'modules/status-effect/types';

type IStatusEffectGetter = () => IStatusEffect;

const StatusEffects = new DataList<StatusEffectID, IStatusEffectGetter>({
	[StatusEffectID.CRIPPLE]: () => ({
		title: 'Cripple',
		id: StatusEffectID.CRIPPLE,
		type: StatusEffectType.PHYSICAL,
		duration: 0
	}),
	[StatusEffectID.DISARM]: () => ({
		title: 'Disarm',
		id: StatusEffectID.DISARM,
		type: StatusEffectType.PHYSICAL,
		duration: 0
	}),
	[StatusEffectID.BLEED]: () => ({
		title: 'Bleed',
		id: StatusEffectID.BLEED,
		type: StatusEffectType.PHYSICAL,
		duration: 0
	}),
	[StatusEffectID.STUN]: () => ({
		title: 'Stun',
		id: StatusEffectID.STUN,
		type: StatusEffectType.PHYSICAL,
		duration: 0
	}),

	[StatusEffectID.BURN]: () => ({
		title: 'Burn',
		id: StatusEffectID.BURN,
		type: StatusEffectType.MAGICAL,
		duration: 0
	}),
	[StatusEffectID.SHOCK]: () => ({
		title: 'Shock',
		id: StatusEffectID.SHOCK,
		type: StatusEffectType.MAGICAL,
		duration: 0
	}),
	[StatusEffectID.FREEZE]: () => ({
		title: 'Freeze',
		id: StatusEffectID.FREEZE,
		type: StatusEffectType.MAGICAL,
		duration: 0
	}),
	[StatusEffectID.FORGET]: () => ({
		title: 'Forget',
		id: StatusEffectID.FORGET,
		type: StatusEffectType.MAGICAL,
		duration: 0
	}),
	[StatusEffectID.SILENCE]: () => ({
		title: 'Silence',
		id: StatusEffectID.SILENCE,
		type: StatusEffectType.MAGICAL,
		duration: 0
	}),
	[StatusEffectID.REGEN]: () => ({
		title: 'Regen',
		id: StatusEffectID.REGEN,
		type: StatusEffectType.SUPPORT,
		duration: 0
	}),
	[StatusEffectID.IRON_SKIN]: () => ({
		title: 'Iron skin',
		id: StatusEffectID.IRON_SKIN,
		type: StatusEffectType.SUPPORT,
		duration: 0
	}),
	[StatusEffectID.BLOCK_SMALL]: () => ({
		title: `Block (${smallShieldBlock})`,
		id: StatusEffectID.BLOCK_SMALL,
		type: StatusEffectType.SUPPORT,
		duration: 0
	}),
	[StatusEffectID.BLOCK_LARGE]: () => ({
		title: 'Block',
		id: StatusEffectID.BLOCK_LARGE,
		type: StatusEffectType.SUPPORT,
		duration: 0
	})
});

export default StatusEffects;
