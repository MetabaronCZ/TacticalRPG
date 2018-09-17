import { defaultBaseAttributes, BaseAttrFormula, SecondaryAttrFormula, Arch2AttTable } from 'data/attributes';

import { ArchetypeID } from 'engine/character/archetype';
import { IBaseAttributes, ISecondaryAttributes, IAttributes } from 'engine/character/attributes-data';

const getBaseAttributes = (archetype: ArchetypeID): IBaseAttributes => {
	const { STR, VIT, SPD, MOV, MAG, SPR } = defaultBaseAttributes;
	const { P, S, M } = Arch2AttTable[archetype];

	return {
		STR: STR + BaseAttrFormula.STR(P, S, M),
		VIT: VIT + BaseAttrFormula.VIT(P, S, M),
		SPD: SPD + BaseAttrFormula.SPD(P, S, M),
		MOV: MOV + BaseAttrFormula.MOV(P, S, M),
		MAG: MAG + BaseAttrFormula.MAG(P, S, M),
		SPR: SPR + BaseAttrFormula.SPR(P, S, M)
	};
};

const getSecondaryAttributes = (baseAttrs: IBaseAttributes): ISecondaryAttributes => ({
	HP: SecondaryAttrFormula.HP(baseAttrs),
	AP: SecondaryAttrFormula.AP(baseAttrs),
	CT: SecondaryAttrFormula.CT(baseAttrs)
});

export const getAttributes = (archetype: ArchetypeID): IAttributes => {
	const baseAttrs = getBaseAttributes(archetype);
	const secondaryAttrs = getSecondaryAttributes(baseAttrs);
	return { ...baseAttrs, ...secondaryAttrs };
};
