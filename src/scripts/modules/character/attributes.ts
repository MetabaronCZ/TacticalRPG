import BaseAttributes from 'modules/character/base-attributes';
import { AttributeID } from 'modules/character/attributes-data';

class Attributes extends BaseAttributes {
	// set attribute value
	public set(attr: AttributeID, value: number) {
		this.values[attr] = value;
	}
}

export default Attributes;
