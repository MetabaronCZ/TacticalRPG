export type ArmorID = 'NONE' | 'ROBE' | 'LIGHT' | 'HEAVY';

export interface IArmorData {
	readonly id: ArmorID;
	readonly title: string;
	readonly description: string;
	readonly physicalDefense: number;
	readonly magicalDefense: number;
}
