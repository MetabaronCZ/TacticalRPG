import Character from 'modules/character';
import { OnBattleInfo } from 'modules/battle/battle-info';
import StatusEffect, { StatusEffectID, OnStatus } from 'modules/battle/status-effect';

const statusEndMsgDelay = 200;

class Status {
	private items: StatusEffect[] = [];

	public has(effectId: StatusEffectID): boolean {
		return !!this.items.find(item => effectId === item.id);
	}

	public get(): StatusEffect[] {
		return [...this.items];
	}

	public apply(effectId: StatusEffectID, ammount = 0, onStatus?: OnStatus): void {
		const effect = new StatusEffect(effectId, ammount, onStatus);
		const existing = this.items.find(item => effectId === item.id);

		if (!existing) {
			// add new StatusEffect
			this.items.push(effect);
			return;
		}
		switch (existing.multi) {
			case 'RENEW':
				// reset values of existing effect
				existing.duration.value = existing.duration.max;
				existing.repeat.value = existing.repeat.max;
				return;

			case 'STACK':
				// add another stack of effect
				this.items.push(effect);
				return;

			case 'IGNORE':
				// only one instance of this effect can be active
				return;

			default:
				throw new Error('Invalid StatusEffect.multi value: ' + existing.multi);
		}
	}

	public remove(effect: StatusEffect): void {
		this.items = this.items.filter(item => effect !== item);
	}

	public removeByID(effectID: StatusEffectID): void {
		this.items = this.items.filter(item => effectID !== item.id);
	}

	public removeAll(): void {
		this.items = [];
	}

	public update(char: Character, cb: OnBattleInfo): void {
		for (const item of this.items) {
			if (char.isDead()) {
				return;
			}
			item.duration.value--;

			if (item.duration.value <= 0) {
				item.duration.value = item.duration.max;
				item.repeat.value--;

				if (item.apply) {
					item.apply(char, cb);
				}

				if (item.repeat.value <= 0) {
					this.remove(item);

					setTimeout(() => {
						let text = 'Status ended';

						if ('DYING' === item.id) {
							text = 'Dead';
						}
						cb({
							text,
							type: (item.buff ? 'BUFF' : 'DEBUFF'),
							status: item.id,
							position: char.position
						});
					}, statusEndMsgDelay);
				}
			}
		}
	}
}

export default Status;
