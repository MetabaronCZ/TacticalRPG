export type SexID = 'MALE' | 'FEMALE';

export interface ISexData {
	readonly id: SexID;
	readonly title: string;
}
