import { defaultBaseAttributes, PrimaryAttrFormula, SecondaryAttrFormula, Arch2AttTable } from 'data/attributes';

import { ArchetypeID } from 'modules/character/archetype';
import { IPrimaryAttributes, ISecondaryAttributes, IAttributes } from 'modules/character/attributes';

class BaseAttributes implements IAttributes {
	protected values: IAttributes;

	constructor(archetype: ArchetypeID) {
		this.values = this.initAttributes(archetype);
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

	private initAttributes = (archetype: ArchetypeID): IAttributes => {
		const { STR, VIT, SPD, MOV, MAG, SPR } = defaultBaseAttributes;
		const { P, S, M } = Arch2AttTable[archetype];

		const primaryAttrs: IPrimaryAttributes = {
			STR: STR + PrimaryAttrFormula.STR(P, S, M),
			VIT: VIT + PrimaryAttrFormula.VIT(P, S, M),
			SPD: SPD + PrimaryAttrFormula.SPD(P, S, M),
			MOV: MOV + PrimaryAttrFormula.MOV(P, S, M),
			MAG: MAG + PrimaryAttrFormula.MAG(P, S, M),
			SPR: SPR + PrimaryAttrFormula.SPR(P, S, M)
		};

		const secondaryAttrs: ISecondaryAttributes = {
			HP: SecondaryAttrFormula.HP(primaryAttrs),
			AP: SecondaryAttrFormula.AP(primaryAttrs),
			CT: SecondaryAttrFormula.CT(primaryAttrs)
		};

		return { ...primaryAttrs, ...secondaryAttrs };
	}
}

export default BaseAttributes;
