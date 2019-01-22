export type ArmorID = 'NONE' | 'LIGHT' | 'HEAVY' | 'MAGICAL';

export interface IArmorData {
	readonly id: ArmorID;
	readonly title: string;
	readonly description: string;
	readonly physical: number;
	readonly magical: number;
}
