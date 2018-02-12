import { BaseAttributes, BaseAttrFormula, SecondaryAttrFormula } from 'data/attributes';
import { IAttributes, IBaseAttributes, ISecondaryAttributes } from 'models/attributes';
import { ArchCharID } from 'models/archetype';

export const getPrimaryAttributes = (primary: ArchCharID, secondary: ArchCharID): IBaseAttributes => {
	const attributes = Object.assign({}, BaseAttributes);
	let P = 0;
	let S = 0;
	let M = 0;

	P += ( ArchCharID.P === primary ? 1 : 0 );
	S += ( ArchCharID.S === primary ? 1 : 0 );
	M += ( ArchCharID.M === primary ? 1 : 0 );

	P += ( ArchCharID.P === secondary ? 0.5 : 0 );
	S += ( ArchCharID.S === secondary ? 0.5 : 0 );
	M += ( ArchCharID.M === secondary ? 0.5 : 0 );

	attributes.STR += BaseAttrFormula.STR(P, S, M);
	attributes.VIT += BaseAttrFormula.VIT(P, S, M);
	attributes.SPD += BaseAttrFormula.SPD(P, S, M);
	attributes.MOV += BaseAttrFormula.MOV(P, S, M);
	attributes.MAG += BaseAttrFormula.MAG(P, S, M);

	return attributes;
};

export const getSecondaryAttributes = (attrs: IBaseAttributes): ISecondaryAttributes => ({
	HP: SecondaryAttrFormula.HP(attrs),
	AP: SecondaryAttrFormula.AP(attrs),
	CP: SecondaryAttrFormula.CP(attrs)
});

export const getAttributes = (primary: ArchCharID, secondary: ArchCharID): IAttributes => {
	const pAttrs = getPrimaryAttributes(primary, secondary);
	const sAttrs = getSecondaryAttributes(pAttrs);

	return { ...pAttrs, ...sAttrs };
};
