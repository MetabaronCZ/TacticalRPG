import DataList from 'core/data-list';
import { smallShieldBlock } from 'data/game-config';
import { IStatusEffect, StatusEffectID } from 'modules/battle/status-effect';
import { formatNumber } from 'core/number';

type StatusEffectFun = (strength?: number) => IStatusEffect;

const StatusEffects = new DataList<StatusEffectID, StatusEffectFun>({
	CRIPPLE: () => ({
		id: 'CRIPPLE',
		title: 'Cripple',
		type: 'PHYSICAL',
		duration: 100
	}),
	DISARM: () => ({
		id: 'DISARM',
		title: 'Disarm',
		type: 'PHYSICAL',
		duration: 100
	}),
	BLEED: (strength = 0) => ({
		id: 'BLEED',
		title: 'Bleed',
		type: 'PHYSICAL',
		duration: 100,
		repeat: 3,
		apply: (char, cb) => {
			const dmg = Math.floor(strength / 2);
			char.applyDamage(dmg);

			cb({
				text: formatNumber(dmg),
				type: 'DAMAGE',
				position: char.position
			});
		}
	}),
	STUN: () => ({
		id: 'STUN',
		title: 'Stun',
		type: 'PHYSICAL',
		duration: 100
	}),
	BURN: (strength = 0) => ({
		id: 'BURN',
		title: 'Burn',
		type: 'MAGICAL',
		duration: 100,
		repeat: 3,
		apply: (char, cb) => {
			const dmg = Math.floor(strength / 2);
			char.applyDamage(dmg);

			cb({
				text: formatNumber(dmg),
				type: 'DAMAGE',
				element: 'FIRE',
				position: char.position
			});
		}
	}),
	SHOCK: () => ({
		id: 'SHOCK',
		title: 'Shock',
		type: 'MAGICAL',
		duration: 100
	}),
	FREEZE: () => ({
		id: 'FREEZE',
		title: 'Freeze',
		type: 'MAGICAL',
		duration: 100
	}),
	FORGET: () => ({
		id: 'FORGET',
		title: 'Forget',
		type: 'MAGICAL',
		duration: 100
	}),
	SILENCE: () => ({
		id: 'SILENCE',
		title: 'Silence',
		type: 'MAGICAL',
		duration: 100
	}),
	REGEN: (strength = 0) => ({
		id: 'REGEN',
		title: 'Regen',
		type: 'SUPPORT',
		duration: 100,
		repeat: 3,
		apply: (char, cb) => {
			const healing = Math.floor(strength / 2);
			char.applyHealing(healing);

			cb({
				text: formatNumber(healing),
				type: 'HEALING',
				position: char.position
			});
		}
	}),
	IRON_SKIN: () => ({
		id: 'IRON_SKIN',
		title: 'Iron skin',
		type: 'SUPPORT',
		duration: 300
	}),
	BLOCK_SMALL: () => ({
		id: 'BLOCK_SMALL',
		title: `Block ${smallShieldBlock * 100}%`,
		type: 'SUPPORT'
	}),
	BLOCK_LARGE: () => ({
		id: 'BLOCK_LARGE',
		title: 'Block',
		type: 'SUPPORT'
	})
});

export default StatusEffects;
