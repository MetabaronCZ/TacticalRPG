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
