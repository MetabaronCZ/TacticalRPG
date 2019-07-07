import StatusEffects from 'data/status-effects';

import Character from 'modules/character';
import { IOnBattleInfo } from 'modules/battle/battle-info';
import { IStatusEffect, StatusEffectID } from 'modules/battle/status-effect';

class Status {
	private items: IStatusEffect[] = [];

	public has(effectId: StatusEffectID): boolean {
		return !!this.items.find(item => effectId === item.id);
	}

	public get(): IStatusEffect[] {
		return this.items;
	}

	public apply(source: Character, effectId: StatusEffectID, physical = 0, magical = 0) {
		const effect = StatusEffects.get(effectId)(source, physical, magical);
		const existing = this.items.find(item => effectId === item.id);

		if (!existing) {
			// add new StatusEffect
			this.items.push(effect);
			return;
		}
		switch (effect.multi) {
			case 'RENEW':
				// add duration and repeat values of existing effect
				existing.duration.value = effect.duration.max;
				existing.repeat.value = effect.repeat.max;
				return;

			case 'STACK':
				// add another stack of this effect
				this.items.push(effect);
				return;

			case 'IGNORE':
				// only one instance of this effect can be active
				return;

			default:
				throw new Error('Invalid StatusEffect.multi value: ' + effect.multi);
		}
	}

	public remove(effect: IStatusEffect) {
		this.items = this.items.filter(item => effect !== item);
	}

	public removeByID(effectID: StatusEffectID) {
		this.items = this.items.filter(item => effectID !== item.id);
	}

	public removeAll() {
		this.items = [];
	}

	public update(char: Character, cb: IOnBattleInfo) {
		for (const item of this.items) {
			item.duration.value--;

			if (item.duration.value <= 0) {
				item.duration.value = StatusEffects.get(item.id)(char, 0, 0).duration.max;
				item.repeat.value--;

				if (item.apply) {
					item.apply(char, cb);
				}

				if (item.repeat.value <= 0) {
					this.remove(item);

					cb({
						text: `${item.title} ended`,
						type: 'ACTION',
						position: char.position
					});
				}
			}
		}
	}
}

export default Status;
