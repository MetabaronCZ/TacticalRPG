import { Arch2AttTable, attributeFormulas } from 'data/attributes';

import Character from 'modules/character';
import { IAttributes, AttributeID } from 'modules/character/attributes';

class BaseAttributes implements IAttributes {
	protected values: IAttributes = {
		STR: 0, VIT: 0,
		MAG: 0, SPR: 0,
		SPD: 0, MOV: 0,
		HP: 0, MP: 0,
		AP: 0, CT: 0
	};

	constructor(character: Character) {
		const { archetype, armor} = character;
		const { P, S, M } = Arch2AttTable[archetype.id];

		for (const key in attributeFormulas) {
			const attr = key as AttributeID;
			this.values[attr] = attributeFormulas[attr](P, S, M);
		}
		this.values.HP += armor.hpBonus || 0;
		this.values.MP += armor.mpBonus || 0;
	}

	public serialize(): IAttributes {
		return {
			STR: this.STR,
			VIT: this.VIT,
			SPD: this.SPD,
			MOV: this.MOV,
			MAG: this.MAG,
			SPR: this.SPR,
			HP: this.HP,
			MP: this.MP,
			AP: this.AP,
			CT: this.CT
		};
	}

	public get STR(): number { return this.values.STR; }
	public get VIT(): number { return this.values.VIT; }
	public get SPD(): number { return this.values.SPD; }
	public get MOV(): number { return this.values.MOV; }
	public get MAG(): number { return this.values.MAG; }
	public get SPR(): number { return this.values.SPR; }

	public get HP(): number { return this.values.HP; }
	public get MP(): number { return this.values.MP; }
	public get AP(): number { return this.values.AP; }
	public get CT(): number { return this.values.CT; }
}

export default BaseAttributes;
