import uuid from 'uuid/v1';

import { SexID } from 'models/sex';
import { JobID } from 'models/job';
import Player from 'models/player';
import Position from 'models/position';
import { ArchCharID } from 'models/archetype';
import { ICharacterData } from 'models/character';
import { IAttributes, getAttributes } from 'models/attributes';

export interface ICharacterConfig extends ICharacterData {
	readonly position: Position;
}

export interface ICharacterAttributes {
	base: IAttributes;
	current: IAttributes;
}

class Character {
	public readonly id: string;
	public readonly name: string;
	public readonly sex: SexID;
	public readonly job: JobID;
	public readonly primary: ArchCharID;
	public readonly secondary: ArchCharID;

	private readonly player: Player;
	private readonly position: Position;
	private readonly baseAttrs: IAttributes;
	private readonly currAttrs: IAttributes;

	constructor(conf: ICharacterConfig, player: Player) {
		this.id = conf.id || uuid();
		this.player = player;
		this.position = conf.position;

		this.baseAttrs = getAttributes(conf.primary, conf.secondary);
		this.currAttrs = getAttributes(conf.primary, conf.secondary);

		this.name = conf.name;
		this.sex = conf.sex;
		this.job = conf.job;
		this.primary = conf.primary;
		this.secondary = conf.secondary;

		// set small random initial CP
		this.currAttrs.CP = Math.floor(10 * Math.random());
	}

	public getAttributes(): ICharacterAttributes {
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
