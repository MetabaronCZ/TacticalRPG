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
		const effect = StatusEffects.get(effectId);
		this.items.push(effect(source, physical, magical));
	}

	public remove(effectId: StatusEffectID) {
		const i = this.items.findIndex(item => effectId === item.id);

		if (-1 !== i) {
			this.items.splice(i, 1);
		}
	}

	public removeAll() {
		this.items = [];
	}

	public update(char: Character, cb: IOnBattleInfo) {
		for (const item of this.items) {
			item.duration = item.duration || 0;
			item.repeat = item.repeat || 0;

			item.duration--;

			if (item.duration <= 0) {
				item.duration = StatusEffects.get(item.id)(char, 0, 0).duration;
				item.repeat--;

				if (item.apply) {
					item.apply(char, cb);
				}

				if (item.repeat <= 0) {
					this.remove(item.id);

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
