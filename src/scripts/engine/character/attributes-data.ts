export type BaseAttributeID =
	'STR' | // strength
	'VIT' | // vitality
	'SPD' | // speed
	'MOV' | // movement
	'MAG' | // magic
	'SPR';  // spirit

export type SecondaryAttributeID =
	'HP' | // hit points
	'AP' | // action points
	'CT';  // charge time

export type AttributeID = BaseAttributeID | SecondaryAttributeID;

export type IBaseAttributes = {
	[attr in BaseAttributeID]: number;
};

export type ISecondaryAttributes = {
	[attr in SecondaryAttributeID]: number;
};

export type IAttributes = IBaseAttributes & ISecondaryAttributes;
