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

export interface IAttributes extends IBaseAttributes, ISecondaryAttributes {}
