import { ArchetypeID } from 'engine/character/archetype';
import { AttributeID, IAttributes, getAttributes } from 'engine/character/attributes';

class BaseAttributes {
	private values: IAttributes;

	constructor(archetype: ArchetypeID) {
		this.values = getAttributes(archetype);
	}

	public get(attr: AttributeID): number {
		return this.values[attr];
	}
}

export default BaseAttributes;
