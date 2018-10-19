import {
	defaultBaseAttributes, PrimaryAttrFormula, SecondaryAttrFormula, Arch2AttTable
} from 'data/attributes';

import { ArchetypeID } from 'modules/character/archetype';
import { IPrimaryAttributes, ISecondaryAttributes, IAttributes, AttributeID } from 'modules/character/attributes-data';

class BaseAttributes {
	protected values: IAttributes;

	constructor(archetype: ArchetypeID) {
		this.values = this.getAttributes(archetype);
	}

	public get(attr: AttributeID): number {
		return this.values[attr];
	}

	private getAttributes = (archetype: ArchetypeID): IAttributes => {
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
