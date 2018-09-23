export type PrimaryAttributeID =
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

export type AttributeID = PrimaryAttributeID | SecondaryAttributeID;

export type IPrimaryAttributes = {
	[attr in PrimaryAttributeID]: number;
};

export type ISecondaryAttributes = {
	[attr in SecondaryAttributeID]: number;
};

export type IAttributes = IPrimaryAttributes & ISecondaryAttributes;
