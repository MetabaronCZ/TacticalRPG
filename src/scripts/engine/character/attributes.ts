import BaseAttributes from 'engine/character/base-attributes';
import { AttributeID } from 'engine/character/attributes-data';

class Attributes extends BaseAttributes {
	// set attribute value
	public set(attr: AttributeID, value: number) {
		this.values[attr] = value;
	}
}

export default Attributes;
