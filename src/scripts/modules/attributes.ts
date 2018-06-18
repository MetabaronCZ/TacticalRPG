import { ArchetypeID } from 'modules/archetype';

interface IBaseAttributes {
	STR: number; // strength
	VIT: number; // vitality
	SPD: number; // speed
	MOV: number; // movement
	MAG: number; // magic
}

interface ISecondaryAttributes {
	HP: number; // hit points
	AP: number; // action points
	CT: number; // charge time
}

type IBaseAttrFormula = (P: number, S: number, M: number) => number;

interface IBaseAttrFormulas {
	readonly STR: IBaseAttrFormula;
	readonly VIT: IBaseAttrFormula;
	readonly SPD: IBaseAttrFormula;
	readonly MOV: IBaseAttrFormula;
	readonly MAG: IBaseAttrFormula;
}

type ISecondaryAttrFormula = (attrs: IBaseAttributes) => number;

interface ISecondaryAttrFormulas {
	readonly HP: ISecondaryAttrFormula;
	readonly AP: ISecondaryAttrFormula;
	readonly CT: ISecondaryAttrFormula;
}

const BaseAttributes: IBaseAttributes = {
	STR: 10,
	VIT: 10,
	SPD: 3,
	MOV: 3,
	MAG: 0
};

const BaseAttrFormula: IBaseAttrFormulas = {
	STR: (P, S, M) => 10 * P,
	VIT: (P, S, M) => 10 * P,
	SPD: (P, S, M) => 2 * S,
	MOV: (P, S, M) => 2 * S,
	MAG: (P, S, M) => 10 * M
};

const SecondaryAttrFormula: ISecondaryAttrFormulas = {
	HP: attrs => 10 * attrs.VIT,
	AP: attrs => 4 * attrs.SPD,
	CT: attrs => 0
};

export type IAttributes = IBaseAttributes & ISecondaryAttributes;

type IArch2AttrTable = {
	[id in ArchetypeID]: {
		P: number;
		S: number;
		M: number;
	};
};

const Arch2AttTable: IArch2AttrTable = {
	[ArchetypeID.PP]: { P: 1.5, S: 0.0, M: 0.0 },
	[ArchetypeID.PS]: { P: 1.0, S: 1.0, M: 0.0 },
	[ArchetypeID.PM]: { P: 1.0, S: 0.0, M: 1.0 },
	[ArchetypeID.SS]: { P: 0.0, S: 1.5, M: 0.0 },
	[ArchetypeID.SM]: { P: 0.0, S: 1.0, M: 1.0 },
	[ArchetypeID.MM]: { P: 0.0, S: 0.0, M: 1.5 }
};

const getPrimary = (archetype: ArchetypeID): IBaseAttributes => {
	const attributes = Object.assign({}, BaseAttributes);

	const P = Arch2AttTable[archetype].P;
	const S = Arch2AttTable[archetype].S;
	const M = Arch2AttTable[archetype].M;

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

export const Attributes = {
	create
};
