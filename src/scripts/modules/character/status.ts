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
			item.duration = item.duration || 0;
			item.repeat = item.repeat || 0;

			item.duration--;

			if (item.duration <= 0) {
				item.duration = StatusEffects.get(item.id)().duration;
				item.repeat--;

				if (item.apply) {
					item.apply(character, cb);
				}

				if (item.repeat <= 0) {
					this.remove(item.id);

					cb({
						text: `${item.title} ended`,
						type: 'ACTION',
						position: character.position
					});
				}
			}
		}
	}
}

export default Status;
