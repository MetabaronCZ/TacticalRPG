import { ArchetypeID } from 'modules/archetype/types';
import { IBaseAttributes, ISecondaryAttributes, IAttributes } from 'modules/attributes/types';
import { getBaseAttributes, BaseAttrFormula, SecondaryAttrFormula, getMutiplier } from 'modules/attributes/formula';

const getPrimary = (archetype: ArchetypeID): IBaseAttributes => {
	const attributes = getBaseAttributes();
	const multiplier = getMutiplier(archetype);

	const P = multiplier.P;
	const S = multiplier.S;
	const M = multiplier.M;

	attributes.STR += BaseAttrFormula.STR(P, S, M);
	attributes.VIT += BaseAttrFormula.VIT(P, S, M);
	attributes.SPD += BaseAttrFormula.SPD(P, S, M);
	attributes.MOV += BaseAttrFormula.MOV(P, S, M);
	attributes.MAG += BaseAttrFormula.MAG(P, S, M);

	return attributes;
};

const getSecondary = (attrs: IBaseAttributes): ISecondaryAttributes => ({
	HP: SecondaryAttrFormula.HP(attrs),
	AP: SecondaryAttrFormula.AP(attrs),
	CT: SecondaryAttrFormula.CT(attrs)
});

const create = (archetype: ArchetypeID): IAttributes => {
	const primaryAttrs = getPrimary(archetype);
	const secondaryAttrs = getSecondary(primaryAttrs);

	return { ...primaryAttrs, ...secondaryAttrs };
};

const Attributes = {
	create
};

export default Attributes;
