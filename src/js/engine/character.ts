import uuid from 'uuid/v1';

import Player from 'engine/player';
import Position from 'engine/position';
import { getAttributes } from 'utils/character/attributes';
import { IAttributes } from 'models/attributes';
import { ICharacter } from 'models/character';
import { JobID } from 'models/job';
import { ArchetypeCharacteristicID as ArchID } from 'models/archetype';
import { SexID } from 'models/sex';

export interface ICharacterConfig extends ICharacter {
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
	public readonly primary: ArchID;
	public readonly secondary: ArchID;

	private readonly conf: ICharacterConfig;
	private readonly player: Player;
	private readonly position: Position;
	private readonly baseAttrs: IAttributes;
	private readonly currAttrs: IAttributes;

	private selected: boolean = false;

	constructor(conf: ICharacterConfig, player: Player) {
		this.id = conf.id || uuid();
		this.conf = conf;
		this.player = player;
		this.position = conf.position;

		this.baseAttrs = getAttributes(conf.primary, conf.secondary);
		this.currAttrs = getAttributes(conf.primary, conf.secondary);

		// set small random initial CP
		this.currAttrs.CP = Math.floor(10 * Math.random());

		// TODO: refactor to methods (getAttributes)
		Object.assign(this, conf);
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

	public isSelected(): boolean {
		return this.selected;
	}

	public select(value?: boolean): void {
		this.selected = ('undefined' !== typeof value) ? value : !this.selected;
	}
}

export default Character;
