import Armors from 'data/armors';
import { ArmorID } from 'engine/equipment/armor-data';

class Armor {
	private readonly id: ArmorID;
	private readonly title: string;
	private readonly description: string;
	private readonly physicalDefense: number;
	private readonly magicalDefense: number;

	constructor(id: ArmorID) {
		const data = Armors.get(id);
		this.id = id;
		this.title = data.title;
		this.description = data.description;
		this.physicalDefense = data.physicalDefense;
		this.magicalDefense = data.magicalDefense;
	}

	public getId(): ArmorID {
		return this.id;
	}

	public getTitle(): string {
		return this.title;
	}

	public getDescription(): string {
		return this.description;
	}

	public getPhysicalDefense(): number {
		return this.physicalDefense;
	}

	public getMagicalDefense(): number {
		return this.magicalDefense;
	}
}

export default Armor;
