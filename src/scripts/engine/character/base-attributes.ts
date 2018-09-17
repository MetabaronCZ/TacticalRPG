import { getAttributes } from 'engine/utils/attributes';
import { ArchetypeID } from 'engine/character/archetype';
import { IAttributes, AttributeID } from 'engine/character/attributes-data';

class BaseAttributes {
	private readonly values: IAttributes;

	constructor(archetype: ArchetypeID) {
		this.values = getAttributes(archetype);
	}

	public get(attr: AttributeID): number {
		return this.values[attr];
	}
}

export default BaseAttributes;
