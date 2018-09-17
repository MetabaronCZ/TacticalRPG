import { getDefaultBaseAttributes, BaseAttrFormula, SecondaryAttrFormula, getMutiplier } from 'engine/character/attributes/formula';
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

const getBaseAttributes = (archetype: ArchetypeID): IBaseAttributes => {
	const { P, S, M } = getMutiplier(archetype);
	const base = getDefaultBaseAttributes();

	return {
		STR: base.STR + BaseAttrFormula.STR(P, S, M),
		VIT: base.VIT + BaseAttrFormula.VIT(P, S, M),
		SPD: base.SPD + BaseAttrFormula.SPD(P, S, M),
		MOV: base.MOV + BaseAttrFormula.MOV(P, S, M),
		MAG: base.MAG + BaseAttrFormula.MAG(P, S, M),
		SPR: base.SPR + BaseAttrFormula.SPR(P, S, M)
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
