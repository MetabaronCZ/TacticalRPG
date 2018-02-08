import { IAttributes, IBaseAttributes, ISecondaryAttributes } from 'models/attributes';
import { ArchCharID } from 'models/archetype';

export const BaseAttributes: IBaseAttributes = {
	STR: 10,
	VIT: 10,
	SPD: 3,
	MOV: 3,
	MAG: 0
};

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

export const getAttributes = (primary: ArchCharID, secondary: ArchCharID): IAttributes => {
	const pAttrs = getPrimaryAttributes(primary, secondary);
	const sAttrs = getSecondaryAttributes(pAttrs);

	return { ...pAttrs, ...sAttrs };
};
