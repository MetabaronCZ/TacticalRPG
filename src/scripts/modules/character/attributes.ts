import BaseAttributes from 'modules/character/base-attributes';

export type AttributeID =
	'STR' | // strength
	'VIT' | // vitality
	'SPD' | // speed
	'MOV' | // movement
	'MAG' | // magic
	'SPR' | // spirit
	'HP' |  // hit points / life
	'MP' |  // magical points / mana
	'AP' |  // action points / stamina
	'CT';   // charge time

export type IAttributes = {
	[attr in AttributeID]: number;
};

class Attributes extends BaseAttributes {
	// set attribute value
	public set(attr: AttributeID, value: number) {
		if (value < 0) {
			throw new Error(`Attribute ${attr} was set to invalid value: ${value}`);
		}
		this.values[attr] = value;
	}
}

export default Attributes;
