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

	public apply(effectId: StatusEffectID, strength?: number) {
		const effect = StatusEffects.get(effectId);
		this.items.push(effect(strength));
	}

	public remove(effectId: StatusEffectID) {
		this.items = this.items.filter(item => item.id !== effectId);
	}

	public update(character: Character, cb: IOnBattleInfo) {
		for (const item of this.items) {
			if ('undefined' !== typeof item.duration) {
				item.duration--;

				if (item.duration <= 0) {
					if ('undefined' !== typeof item.repeat) {
						item.repeat--;
					}

					if (item.apply) {
						item.apply(character, cb);
					}

					if (!item.repeat) {
						this.remove(item.id);
					}
				}
			}
		}
	}
}

export default Status;
