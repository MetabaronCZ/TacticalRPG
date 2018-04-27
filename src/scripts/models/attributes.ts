import { ArchCharID } from 'models/archetype';

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

interface IBaseAttributes {
	STR: number;
	VIT: number;
	SPD: number;
	MOV: number;
	MAG: number;
}

interface ISecondaryAttributes {
	HP: number;
	AP: number;
	CT: number;
}

export type IAttributes = IBaseAttributes & ISecondaryAttributes;

export class Attributes {
	public static create(primary: ArchCharID, secondary: ArchCharID): IAttributes {
		const pAttrs = Attributes.getPrimary(primary, secondary);
		const sAttrs = Attributes.getSecondary(pAttrs);

		return { ...pAttrs, ...sAttrs };
	}

	private static getPrimary(primary: ArchCharID, secondary: ArchCharID): IBaseAttributes {
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
	}

	private static getSecondary(attrs: IBaseAttributes): ISecondaryAttributes {
		return {
			HP: SecondaryAttrFormula.HP(attrs),
			AP: SecondaryAttrFormula.AP(attrs),
			CT: SecondaryAttrFormula.CT(attrs)
		};
	}
}
