import { getAttributes } from 'data/attributes';

import Character from 'modules/character';
import { IAttributes } from 'modules/character/attributes';

class BaseAttributes implements IAttributes {
	protected values: IAttributes;

	constructor(character: Character) {
		this.values = getAttributes(character);
	}

	public get STR(): number { return this.values.STR; }
	public get VIT(): number { return this.values.VIT; }
	public get SPD(): number { return this.values.SPD; }
	public get MOV(): number { return this.values.MOV; }
	public get MAG(): number { return this.values.MAG; }
	public get SPR(): number { return this.values.SPR; }

	public get HP(): number { return this.values.HP; }
	public get AP(): number { return this.values.AP; }
	public get CT(): number { return this.values.CT; }
	public get ARM(): number { return this.values.ARM; }
	public get ESH(): number { return this.values.ESH; }
}

export default BaseAttributes;
