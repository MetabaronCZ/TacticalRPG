export type ArmorID = 'NONE' | 'ROBE' | 'LIGHT' | 'HEAVY';

export interface IArmorData {
	readonly title: string;
	readonly description: string;
	readonly physicalDefense: number;
	readonly magicalDefense: number;
}
