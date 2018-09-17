import Armors from 'data/armors';
import { ArmorID } from 'engine/equipment/armor-data';

class Armor {
	public readonly id: ArmorID;
	public readonly title: string;
	public readonly description: string;
	public readonly physicalDefense: number;
	public readonly magicalDefense: number;

	constructor(id: ArmorID) {
		const data = Armors.get(id);
		this.id = id;
		this.title = data.title;
		this.description = data.description;
		this.physicalDefense = data.physicalDefense;
		this.magicalDefense = data.magicalDefense;
	}
}

export default Armor;
