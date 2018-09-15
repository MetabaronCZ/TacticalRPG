import { IBaseAttributes } from 'modules/attributes/types';
import { ArchetypeID } from 'engine/character/archetype';

type IBaseAttrFormula = (P: number, S: number, M: number) => number;

interface IBaseAttrFormulas {
	readonly STR: IBaseAttrFormula;
	readonly VIT: IBaseAttrFormula;
	readonly SPD: IBaseAttrFormula;
	readonly MOV: IBaseAttrFormula;
	readonly MAG: IBaseAttrFormula;
	readonly SPR: IBaseAttrFormula;
}

type ISecondaryAttrFormula = (attrs: IBaseAttributes) => number;

interface ISecondaryAttrFormulas {
	readonly HP: ISecondaryAttrFormula;
	readonly AP: ISecondaryAttrFormula;
	readonly CT: ISecondaryAttrFormula;
}

type IArch2AttrTable = {
	[id in ArchetypeID]: {
		P: number;
		S: number;
		M: number;
	};
};

const Arch2AttTable: IArch2AttrTable = {
	PP: { P: 1.5, S: 0.0, M: 0.0 },
	PS: { P: 1.0, S: 1.0, M: 0.0 },
	PM: { P: 1.0, S: 0.0, M: 1.0 },
	SS: { P: 0.0, S: 1.5, M: 0.0 },
	SM: { P: 0.0, S: 1.0, M: 1.0 },
	MM: { P: 0.0, S: 0.0, M: 1.5 }
};

export const getBaseAttributes = (): IBaseAttributes => ({
	STR: 10,
	VIT: 10,
	SPD: 3,
	MOV: 3,
	MAG: 0,
	SPR: 0
});

export const getMutiplier = (arch: ArchetypeID) => Arch2AttTable[arch];

export const BaseAttrFormula: IBaseAttrFormulas = {
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
