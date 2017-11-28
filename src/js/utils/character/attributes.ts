import { PrimaryID } from 'models/primary';
import { SecondaryID } from 'models/secondary';
import { IAttributes, IBaseAttributes, ISecondaryAttributes } from 'models/attributes';

export const BaseAttributes: IBaseAttributes = {
	STR: 10,
	VIT: 10,
	SPD: 3,
	MOV: 3,
	MAG: 0
};

export const getPrimaryAttributes = (primary: PrimaryID, secondary: SecondaryID): IBaseAttributes => {
	const attributes: IBaseAttributes = Object.assign({}, BaseAttributes);
	let P = 0;
	let S = 0;
	let M = 0;

	P += ( 'P' === primary ? 1 : 0 );
	S += ( 'S' === primary ? 1 : 0 );
	M += ( 'M' === primary ? 1 : 0 );

	P += ( 'P' === secondary ? 0.5 : 0 );
	S += ( 'S' === secondary ? 0.5 : 0 );
	M += ( 'M' === secondary ? 0.5 : 0 );

	attributes.STR += 10 * P;
	attributes.VIT += 10 * P;
	attributes.SPD += 2 * S;
	attributes.MOV += 2 * S;
	attributes.MAG += 10 * M;

	return attributes;
};

export const getSecondaryAttributes = (attrs: IBaseAttributes): ISecondaryAttributes => ({
	HP: 10 * attrs.VIT,
	AP: 4 * attrs.SPD,
	CP: 0
});

export const getAttributes = (primary: PrimaryID, secondary: SecondaryID): IAttributes => {
	const pAttrs = getPrimaryAttributes(primary, secondary);
	const sAttrs = getSecondaryAttributes(pAttrs);

	return { ...pAttrs, ...sAttrs };
};
