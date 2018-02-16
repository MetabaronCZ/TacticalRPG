import { BaseAttributes, BaseAttrFormula, SecondaryAttrFormula } from 'data/attributes';
import { IAttributes, IBaseAttributes, ISecondaryAttributes } from 'models/attributes';
import { ArchCharID } from 'models/archetype';

export interface IBaseAttributes {
	STR: number;
	VIT: number;
	SPD: number;
	MOV: number;
	MAG: number;
}

export interface ISecondaryAttributes {
	HP: number;
	AP: number;
	CP: number;
}

export type IBaseAttrFormula = (P: number, S: number, M: number) => number;

export interface IBaseAttrFormulas {
	STR: IBaseAttrFormula;
	VIT: IBaseAttrFormula;
	SPD: IBaseAttrFormula;
	MOV: IBaseAttrFormula;
	MAG: IBaseAttrFormula;
}

export type ISecondaryAttrFormula = (attrs: IBaseAttributes) => number;

export interface ISecondaryAttrFormulas {
	HP: ISecondaryAttrFormula;
	AP: ISecondaryAttrFormula;
	CP: ISecondaryAttrFormula;
}

export interface IAttributes extends IBaseAttributes, ISecondaryAttributes {}

export class Attributes {
	public static create(primary: ArchCharID, secondary: ArchCharID): IAttributes {
		const pAttrs = this.getPrimary(primary, secondary);
		const sAttrs = this.getSecondary(pAttrs);

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
			CP: SecondaryAttrFormula.CP(attrs)
		};
	}
}
