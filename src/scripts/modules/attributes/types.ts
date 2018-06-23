export interface IBaseAttributes {
	STR: number; // strength
	VIT: number; // vitality
	SPD: number; // speed
	MOV: number; // movement
	MAG: number; // magic
}

export interface ISecondaryAttributes {
	HP: number; // hit points
	AP: number; // action points
	CT: number; // charge time
}

export type IAttributes = IBaseAttributes & ISecondaryAttributes;
