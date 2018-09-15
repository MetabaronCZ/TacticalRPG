import { getBaseAttributes, BaseAttrFormula, SecondaryAttrFormula, getMutiplier } from 'engine/character/attributes/formula';
import { ArchetypeID } from 'engine/character/archetype';

export type BaseAttributeID =
	'STR' | // strength
	'VIT' | // vitality
	'SPD' | // speed
	'MOV' | // movement
	'MAG' | // magic
	'SPR';  // spirit

export type SecondaryAttributeID =
	'HP' | // hit points
	'AP' | // action points
	'CT';  // charge time

export type AttributeID = BaseAttributeID | SecondaryAttributeID;

export type IBaseAttributes = {
	[attr in BaseAttributeID]: number;
};

export type ISecondaryAttributes = {
	[attr in SecondaryAttributeID]: number;
};

export type IAttributes = IBaseAttributes & ISecondaryAttributes;

class Attributes {
	private base: IAttributes;
	private current: IAttributes;

	constructor(archetype: ArchetypeID) {
		this.base = this.getAttributes(archetype);
		this.current = this.getAttributes(archetype);
	}

	public getBase(): IAttributes {
		return this.base;
	}

	public getCurrent(): IAttributes {
		return this.current;
	}

	// set attribute value
	public set(attr: AttributeID, value: number) {
		this.current[attr] = value;
	}

	private getAttributes(archetype: ArchetypeID): IAttributes {
		const baseAttrs = this.getBaseAttributes(archetype);
		const secondaryAttrs = this.getSecondaryAttributes(baseAttrs);
		return { ...baseAttrs, ...secondaryAttrs };
	}

	private getBaseAttributes(archetype: ArchetypeID): IBaseAttributes {
		const { P, S, M } = getMutiplier(archetype);
		const base = getBaseAttributes();

		return {
			STR: base.STR + BaseAttrFormula.STR(P, S, M),
			VIT: base.VIT + BaseAttrFormula.VIT(P, S, M),
			SPD: base.SPD + BaseAttrFormula.SPD(P, S, M),
			MOV: base.MOV + BaseAttrFormula.MOV(P, S, M),
			MAG: base.MAG + BaseAttrFormula.MAG(P, S, M),
			SPR: base.SPR + BaseAttrFormula.SPR(P, S, M)
		};
	}

	private getSecondaryAttributes(baseAttrs: IBaseAttributes): ISecondaryAttributes {
		return {
			HP: SecondaryAttrFormula.HP(baseAttrs),
			AP: SecondaryAttrFormula.AP(baseAttrs),
			CT: SecondaryAttrFormula.CT(baseAttrs)
		};
	}
}

export default Attributes;
