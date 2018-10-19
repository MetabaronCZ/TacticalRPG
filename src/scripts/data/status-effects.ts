import DataList from 'core/data-list';
import { smallShieldBlock } from 'data/game-config';
import { IStatusEffect, StatusEffectID } from 'modules/battle/status-effect';

type StatusEffectFun = () => IStatusEffect;

const StatusEffects = new DataList<StatusEffectID, StatusEffectFun>({
	CRIPPLE:		() => ({ title: 'Cripple', id: 'CRIPPLE', type: 'PHYSICAL', duration: 0 }),
	DISARM:			() => ({ title: 'Disarm', id: 'DISARM', type: 'PHYSICAL', duration: 0 }),
	BLEED:			() => ({ title: 'Bleed', id: 'BLEED', type: 'PHYSICAL', duration: 0 }),
	STUN:			() => ({ title: 'Stun', id: 'STUN', type: 'PHYSICAL', duration: 0 }),
	BURN:			() => ({ title: 'Burn', id: 'BURN', type: 'MAGICAL', duration: 0 }),
	SHOCK:			() => ({ title: 'Shock', id: 'SHOCK', type: 'MAGICAL', duration: 0 }),
	FREEZE:			() => ({ title: 'Freeze', id: 'FREEZE', type: 'MAGICAL', duration: 0 }),
	FORGET:			() => ({ title: 'Forget', id: 'FORGET', type: 'MAGICAL', duration: 0 }),
	SILENCE:		() => ({ title: 'Silence', id: 'SILENCE', type: 'MAGICAL', duration: 0 }),
	REGEN:			() => ({ title: 'Regen', id: 'REGEN', type: 'SUPPORT', duration: 0 }),
	IRON_SKIN:		() => ({ title: 'Iron skin', id: 'IRON_SKIN', type: 'SUPPORT', duration: 0 }),
	BLOCK_SMALL:	() => ({ title: `Block ${smallShieldBlock * 100}%`, id: 'BLOCK_SMALL', type: 'SUPPORT', duration: 0 }),
	BLOCK_LARGE:	() => ({ title: 'Block', id: 'BLOCK_LARGE', type: 'SUPPORT', duration: 0 })
});

export default StatusEffects;
