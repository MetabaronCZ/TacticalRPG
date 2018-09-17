import { ArchetypeID } from 'engine/character/archetype';
import { AttributeID, IAttributes, getAttributes } from 'engine/character/attributes';

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
