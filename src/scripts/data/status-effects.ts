import DataList from 'core/data-list';
import { formatNumber } from 'core/number';

import Character from 'modules/character';
import { IStatusEffect, StatusEffectID } from 'modules/battle/status-effect';

type StatusEffectFun = (source: Character, phy: number, mag: number) => IStatusEffect;

const StatusEffects = new DataList<StatusEffectID, StatusEffectFun>({
	CRIPPLE: () => ({
		id: 'CRIPPLE',
		title: 'Cripple',
		effect: 'Crippled',
		description: 'Cannot move',
		type: 'PHYSICAL',
		multi: 'RENEW',
		duration: { value: 100, max: 100 },
		repeat: { value: 0, max: 0 }
	}),
	DISARM: () => ({
		id: 'DISARM',
		title: 'Disarm',
		effect: 'Disarmed',
		description: 'Cannot use weapon attacks and skills',
		type: 'PHYSICAL',
		multi: 'RENEW',
		duration: { value: 100, max: 100 },
		repeat: { value: 0, max: 0 }
	}),
	BLEED: (src, phy) => ({
		id: 'BLEED',
		title: 'Bleed',
		effect: 'Wounded',
		description: 'Physical damage over time',
		type: 'PHYSICAL',
		multi: 'STACK',
		duration: { value: 33, max: 33 },
		repeat: { value: 3, max: 3 },
		apply: (tgt, cb) => {
			const dmg = Math.floor(phy / 2);
			tgt.applyDamage(src, dmg, 0, 0);

			cb({
				text: formatNumber(dmg),
				type: 'DAMAGE',
				position: tgt.position
			});
		}
	}),
	STUN: () => ({
		id: 'STUN',
		title: 'Stun',
		effect: 'Stunned',
		description: 'Cannot act',
		type: 'PHYSICAL',
		multi: 'RENEW',
		duration: { value: 100, max: 100 },
		repeat: { value: 0, max: 0 }
	}),
	BURN: (src, phy, mag) => ({
		id: 'BURN',
		title: 'Burn',
		effect: 'Burning',
		description: 'Fire elemental damage over time',
		type: 'MAGICAL',
		multi: 'STACK',
		duration: { value: 33, max: 33 },
		repeat: { value: 3, max: 3 },
		apply: (tgt, cb) => {
			const dmg = Math.floor(mag / 2);
			tgt.applyDamage(src, 0, dmg, 0);

			cb({
				text: formatNumber(dmg),
				type: 'DAMAGE',
				element: 'FIRE',
				position: tgt.position
			});
		}
	}),
	BERSERK: () => ({
		id: 'BERSERK',
		title: 'Berserk',
		effect: 'Berserking',
		description: 'Damage given and damage taken doubled',
		type: 'MAGICAL',
		multi: 'RENEW',
		duration: { value: 100, max: 100 },
		repeat: { value: 0, max: 0 }
	}),
	SHOCK: () => ({
		id: 'SHOCK',
		title: 'Shock',
		effect: 'Shocked',
		description: 'Halves damage reduction ability',
		type: 'MAGICAL',
		multi: 'RENEW',
		duration: { value: 100, max: 100 },
		repeat: { value: 0, max: 0 }
	}),
	FREEZE: () => ({
		id: 'FREEZE',
		title: 'Freeze',
		effect: 'Frozen',
		description: 'Cannot act',
		type: 'MAGICAL',
		multi: 'RENEW',
		duration: { value: 100, max: 100 },
		repeat: { value: 0, max: 0 }
	}),
	CONFUSION: () => ({
		id: 'CONFUSION',
		title: 'Confusion',
		effect: 'Confused',
		description: 'Weapon and magical skill cost doubled',
		type: 'MAGICAL',
		multi: 'RENEW',
		duration: { value: 100, max: 100 },
		repeat: { value: 0, max: 0 }
	}),
	SILENCE: () => ({
		id: 'SILENCE',
		title: 'Silence',
		effect: 'Silenced',
		description: 'Cannot use magical skills',
		type: 'MAGICAL',
		multi: 'RENEW',
		duration: { value: 100, max: 100 },
		repeat: { value: 0, max: 0 }
	}),
	DYING: () => ({
		id: 'DYING',
		title: 'Dying',
		effect: 'Dying',
		description: 'Incapacitated',
		type: 'PHYSICAL',
		multi: 'IGNORE',
		duration: { value: 100, max: 100 },
		repeat: { value: 0, max: 0 },
		apply: (char, cb) => {
			char.die();

			cb({
				text: 'Dead',
				type: 'ACTION',
				position: char.position
			});
		}
	}),
	REGEN: (src, phy, mag) => ({
		id: 'REGEN',
		title: 'Regen',
		effect: 'Rejuvenating',
		description: 'Healing over time',
		type: 'SUPPORT',
		multi: 'STACK',
		duration: { value: 33, max: 33 },
		repeat: { value: 3, max: 3 },
		apply: (tgt, cb) => {
			const healing = Math.floor(mag / 2);
			tgt.applyHealing(src, healing);

			cb({
				text: formatNumber(healing),
				type: 'HEALING',
				position: tgt.position
			});
		}
	}),
	IRON_SKIN: () => ({
		id: 'IRON_SKIN',
		title: 'Iron skin',
		effect: 'Hardened',
		description: 'Doubles damage reduction ability',
		type: 'SUPPORT',
		multi: 'RENEW',
		duration: { value: 100, max: 100 },
		repeat: { value: 0, max: 0 }
	}),
	BLOCK_SMALL: () => ({
		id: 'BLOCK_SMALL',
		title: 'Block',
		effect: 'Blocked',
		description: 'Shield based damage reduction',
		type: 'SUPPORT',
		multi: 'IGNORE',
		duration: { value: 0, max: 0 },
		repeat: { value: 0, max: 0 }
	}),
	BLOCK_LARGE: () => ({
		id: 'BLOCK_LARGE',
		title: 'Block',
		effect: 'Blocked',
		description: 'Shield based damage reduction',
		type: 'SUPPORT',
		multi: 'IGNORE',
		duration: { value: 0, max: 0 },
		repeat: { value: 0, max: 0 }
	}),
	ENERGY_SHIELD: () => ({
		id: 'ENERGY_SHIELD',
		title: 'Energy Shield',
		effect: 'Shielded',
		description: 'Mana based energy shield damage reduction',
		type: 'SUPPORT',
		multi: 'IGNORE',
		duration: { value: 0, max: 0 },
		repeat: { value: 0, max: 0 }
	})
});

export default StatusEffects;
