import { getAttributes } from 'engine/utils/attributes';
import { ArchetypeID } from 'engine/character/archetype';
import { IAttributes, AttributeID } from 'engine/character/attributes-data';

class Attributes {
	private values: IAttributes;

	constructor(archetype: ArchetypeID) {
		this.values = getAttributes(archetype);
	}

	public get(attr: AttributeID): number {
		return this.values[attr];
	}

	// set attribute value
	public set(attr: AttributeID, value: number) {
		this.values[attr] = value;
	}
}

export default Attributes;
