import { IArmorData } from 'engine/armor-data';

class Armor {
	private readonly title: string;
	private readonly description: string;
	private readonly physicalDefense: number;
	private readonly magicalDefense: number;

	constructor(data: IArmorData) {
		this.title = data.title;
		this.description = data.description;
		this.physicalDefense = data.physicalDefense;
		this.magicalDefense = data.magicalDefense;
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
