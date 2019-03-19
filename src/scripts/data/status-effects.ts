import DataList from 'core/data-list';
import { formatNumber } from 'core/number';

import { IStatusEffect, StatusEffectID } from 'modules/battle/status-effect';

type StatusEffectFun = (phy?: number, mag?: number) => IStatusEffect;

const StatusEffects = new DataList<StatusEffectID, StatusEffectFun>({
	CRIPPLE: () => ({
		id: 'CRIPPLE',
		title: 'Cripple',
		effect: 'Crippled',
		description: 'Cannot move',
		type: 'PHYSICAL',
		duration: 100
	}),
	DISARM: () => ({
		id: 'DISARM',
		title: 'Disarm',
		effect: 'Disarmed',
		description: 'Cannot use weapon attacks and skills',
		type: 'PHYSICAL',
		duration: 100
	}),
	BLEED: (phy = 0) => ({
		id: 'BLEED',
		title: 'Bleed',
		effect: 'Wounded',
		description: 'Physical damage over time',
		type: 'PHYSICAL',
		duration: 33,
		repeat: 3,
		apply: (char, cb) => {
			const dmg = Math.floor(phy / 2);
			char.applyDamage(dmg, 0);

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
		effect: 'Stunned',
		description: 'Cannot act',
		type: 'PHYSICAL',
		duration: 100
	}),
	BURN: (phy = 0, mag = 0) => ({
		id: 'BURN',
		title: 'Burn',
		effect: 'Burning',
		description: 'Fire elemental damage over time',
		type: 'MAGICAL',
		duration: 33,
		repeat: 3,
		apply: (char, cb) => {
			const dmg = Math.floor(mag / 2);
			char.applyDamage(0, dmg);

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
		effect: 'Shocked',
		description: 'Halves damage reduction ability',
		type: 'MAGICAL',
		duration: 100
	}),
	FREEZE: () => ({
		id: 'FREEZE',
		title: 'Freeze',
		effect: 'Frozen',
		description: 'Cannot act',
		type: 'MAGICAL',
		duration: 100
	}),
	CONFUSION: () => ({
		id: 'CONFUSION',
		title: 'Confusion',
		effect: 'Confused',
		description: 'Weapon and magical skill cost doubled',
		type: 'MAGICAL',
		duration: 100
	}),
	SILENCE: () => ({
		id: 'SILENCE',
		title: 'Silence',
		effect: 'Silenced',
		description: 'Cannot use magical skills',
		type: 'MAGICAL',
		duration: 100
	}),
	REGEN: (phy = 0, mag = 0) => ({
		id: 'REGEN',
		title: 'Regen',
		effect: 'Rejuvenating',
		description: 'Healing over time',
		type: 'SUPPORT',
		duration: 33,
		repeat: 3,
		apply: (char, cb) => {
			const healing = Math.floor(mag / 2);
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
		effect: 'Hardened',
		description: 'Doubles damage reduction ability',
		type: 'SUPPORT',
		duration: 100
	}),
	BLOCK_SMALL: () => ({
		id: 'BLOCK_SMALL',
		title: 'Block',
		effect: 'Blocked',
		description: 'Shield based damage reduction',
		type: 'SUPPORT'
	}),
	BLOCK_LARGE: () => ({
		id: 'BLOCK_LARGE',
		title: 'Block',
		effect: 'Blocked',
		description: 'Shield based damage reduction',
		type: 'SUPPORT'
	})
});

export default StatusEffects;
