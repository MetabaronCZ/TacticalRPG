export enum ArmorID {
	NONE = 'NONE',
	ROBE = 'ROBE',
	LIGHT = 'LIGHT',
	HEAVY = 'HEAVY'
}

export interface IArmorData {
	readonly title: string;
	readonly description: string;
	readonly physicalDefense: number;
	readonly magicalDefense: number;
}
