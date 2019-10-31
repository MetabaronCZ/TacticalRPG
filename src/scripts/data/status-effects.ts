import DataList from 'core/data-list';
import { formatNumber } from 'core/number';

import { IStatusEffect, StatusEffectID } from 'modules/battle/status-effect';

const StatusEffects = new DataList<StatusEffectID, IStatusEffect>({
	CRIPPLE: {
		title: 'Cripple',
		effect: 'Crippled',
		description: 'Cannot move',
		type: 'PHYSICAL',
		multi: 'RENEW',
		duration: 100
	},
	DISARM: {
		title: 'Disarm',
		effect: 'Disarmed',
		description: 'Cannot use weapon attacks and skills',
		type: 'PHYSICAL',
		multi: 'RENEW',
		duration: 100
	},
	BLEED: {
		title: 'Bleed',
		effect: 'Wounded',
		description: 'Physical damage over time',
		type: 'PHYSICAL',
		multi: 'STACK',
		duration: 33,
		repeat: 3,
		apply: (tgt, ammount, onStatus, onInfo) => {
			const dmg = Math.floor(ammount / 2);
			tgt.onDamage(dmg, 0, [], onStatus);

			onInfo({
				text: formatNumber(dmg),
				type: 'DAMAGE',
				status: 'BLEED',
				position: tgt.position
			});
		}
	},
	STUN: {
		title: 'Stun',
		effect: 'Stunned',
		description: 'Cannot act',
		type: 'PHYSICAL',
		multi: 'RENEW',
		duration: 100
	},
	BURN: {
		title: 'Burn',
		effect: 'Burning',
		description: 'Fire elemental damage over time',
		type: 'MAGICAL',
		multi: 'STACK',
		duration: 33,
		repeat: 3,
		apply: (tgt, ammount, onStatus, onInfo) => {
			const dmg = Math.floor(ammount / 2);
			tgt.onDamage(dmg, 0, [], onStatus);

			onInfo({
				text: formatNumber(dmg),
				type: 'DAMAGE',
				status: 'BURN',
				position: tgt.position
			});
		}
	},
	BERSERK: {
		title: 'Berserk',
		effect: 'Berserking',
		description: 'Damage given and damage taken doubled',
		type: 'MAGICAL',
		multi: 'RENEW',
		duration: 100
	},
	SHOCK: {
		title: 'Shock',
		effect: 'Shocked',
		description: 'Halves damage reduction ability',
		type: 'MAGICAL',
		multi: 'RENEW',
		duration: 100
	},
	FREEZE: {
		title: 'Freeze',
		effect: 'Frozen',
		description: 'Cannot act',
		type: 'MAGICAL',
		multi: 'RENEW',
		duration: 100
	},
	CONFUSION: {
		title: 'Confusion',
		effect: 'Confused',
		description: 'Weapon and magical skill cost doubled',
		type: 'MAGICAL',
		multi: 'RENEW',
		duration: 100
	},
	SILENCE: {
		title: 'Silence',
		effect: 'Silenced',
		description: 'Cannot use magical skills',
		type: 'MAGICAL',
		multi: 'RENEW',
		duration: 100
	},
	DYING: {
		title: 'Dying',
		effect: 'Dying',
		description: 'Incapacitated',
		type: 'PHYSICAL',
		multi: 'IGNORE',
		duration: 100,
		apply: tgt => tgt.die()
	},
	REGEN: {
		title: 'Regen',
		effect: 'Rejuvenating',
		description: 'Healing over time',
		type: 'SUPPORT',
		multi: 'STACK',
		duration: 33,
		repeat: 3,
		apply: (tgt, ammount, onStatus, onInfo) => {
			const healing = Math.floor(ammount / 2);
			tgt.onHealing(healing, [], onStatus);

			onInfo({
				text: formatNumber(healing),
				type: 'HEALING',
				status: 'REGEN',
				position: tgt.position
			});
		}
	},
	IRON_SKIN: {
		title: 'Iron skin',
		effect: 'Hardened',
		description: 'Doubles damage reduction ability',
		type: 'SUPPORT',
		multi: 'RENEW',
		duration: 100
	},
	BLOCK_SMALL: {
		title: 'Block',
		effect: 'Blocked',
		description: 'Shield based damage reduction',
		type: 'SUPPORT',
		multi: 'IGNORE'
	},
	BLOCK_LARGE: {
		title: 'Block',
		effect: 'Blocked',
		description: 'Shield based damage reduction',
		type: 'SUPPORT',
		multi: 'IGNORE'
	},
	AETHERSHIELD: {
		title: 'Aethershield',
		effect: 'Shielded',
		description: 'Mana based energy shield damage reduction',
		type: 'SUPPORT',
		multi: 'IGNORE'
	}
});

export default StatusEffects;
