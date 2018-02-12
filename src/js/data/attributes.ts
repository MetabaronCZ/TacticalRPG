import { IBaseAttributes, IBaseAttrFormulas, ISecondaryAttrFormulas } from 'models/attributes';

export const BaseAttributes: IBaseAttributes = {
	STR: 10,
	VIT: 10,
	SPD: 3,
	MOV: 3,
	MAG: 0
};

export const BaseAttrFormula: IBaseAttrFormulas = {
	STR: (P, S, M) => 10 * P,
	VIT: (P, S, M) => 10 * P,
	SPD: (P, S, M) => 2 * S,
	MOV: (P, S, M) => 2 * S,
	MAG: (P, S, M) => 10 * M
};

export const SecondaryAttrFormula: ISecondaryAttrFormulas = {
	HP: (attrs) => 10 * attrs.VIT,
	AP: (attrs) => 4 * attrs.SPD,
	CP: (attrs) => 0
};
