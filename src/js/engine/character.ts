import uuid from 'uuid/v1';

import Player from 'engine/player';
import Position from 'engine/position';
import { getAttributes } from 'utils/character/attributes';
import { IAttributes } from 'models/attributes';
import { PrimaryID } from 'models/primary';
import { SecondaryID } from 'models/secondary';
import { ICharacter } from 'models/character';

export interface ICharacterConfig extends ICharacter {
	readonly position: number[];
}

class Character {
	public readonly id: string;
	private readonly conf: ICharacterConfig;
	private readonly player: Player;
	private position: Position;
	private readonly baseAttrs: IAttributes;
	private currAttrs: IAttributes;

	constructor(conf: ICharacterConfig, player: Player) {
		this.id = conf.id || uuid();
		this.conf = conf;
		this.player = player;
		this.position = new Position(...conf.position);

		this.baseAttrs = getAttributes(conf.primary, conf.secondary);
		this.currAttrs = getAttributes(conf.primary, conf.secondary);

		// set small random initial CP
		this.currAttrs.CP = Math.floor(10 * Math.random());

		Object.assign(this, conf); // TODO: refactor to methods (getAttributes)
	}

	public getAttributes() {
		return {
			base: this.baseAttrs,
			current: this.currAttrs
		};
	}

	public getPlayer(): Player {
		return this.player;
	}

	public getPosition(): Position {
		return this.position;
	}
}

export default Character;
