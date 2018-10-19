import { ArchetypeID } from 'modules/character/archetype';
import { PrimaryAttributeID, SecondaryAttributeID, IPrimaryAttributes } from 'modules/character/attributes';

type IPrimaryAttrFormula = (P: number, S: number, M: number) => number;

type IPrimaryAttrFormulas = {
	readonly [attr in PrimaryAttributeID]: IPrimaryAttrFormula;
};

type ISecondaryAttrFormula = (attrs: IPrimaryAttributes) => number;

type ISecondaryAttrFormulas = {
	readonly [attr in SecondaryAttributeID]: ISecondaryAttrFormula;
};

type IArch2AttrTable = {
	[id in ArchetypeID]: {
		P: number;
		S: number;
		M: number;
	};
};

export const Arch2AttTable: IArch2AttrTable = {
	PP: { P: 1.5, S: 0.0, M: 0.0 },
	PS: { P: 1.0, S: 1.0, M: 0.0 },
	PM: { P: 1.0, S: 0.0, M: 1.0 },
	SS: { P: 0.0, S: 1.5, M: 0.0 },
	SM: { P: 0.0, S: 1.0, M: 1.0 },
	MM: { P: 0.0, S: 0.0, M: 1.5 }
};

export const defaultBaseAttributes: IPrimaryAttributes = {
	STR: 10,
	VIT: 10,
	SPD: 3,
	MOV: 3,
	MAG: 0,
	SPR: 0
};

export const PrimaryAttrFormula: IPrimaryAttrFormulas = {
	STR: (P, S, M) => 10 * P,
	VIT: (P, S, M) => 10 * P,
	SPD: (P, S, M) => 2 * S,
	MOV: (P, S, M) => 2 * S,
	MAG: (P, S, M) => 10 * M,
	SPR: (P, S, M) => 10 * M
};

export const SecondaryAttrFormula: ISecondaryAttrFormulas = {
	HP: attrs => 10 * attrs.VIT,
	AP: attrs => 4 * attrs.SPD,
	CT: attrs => 0
};
