import BaseAttributes from 'modules/character/base-attributes';

export type AttributeID =
	'STR' | // strength
	'VIT' | // vitality
	'SPD' | // speed
	'MOV' | // movement
	'MAG' | // magic
	'SPR' |  // spirit
	'HP' |  // hit points / life
	'AP' |  // action points / stamina
	'CT' |  // charge time
	'ARM' | // armor
	'ESH';  // energy shield

export type IAttributes = {
	[attr in AttributeID]: number;
};

class Attributes extends BaseAttributes {
	// set attribute value
	public set(attr: AttributeID, value: number) {
		this.values[attr] = value;
	}
}

export default Attributes;
