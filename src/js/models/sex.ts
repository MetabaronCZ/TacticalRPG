import DataList from 'models/data-list';

export enum SexID {
	MALE = 'MALE',
	FEMALE = 'FEMALE'
}

export interface ISexData {
	readonly title: string;
}

export const Sexes = new DataList<SexID, ISexData>([
	[SexID.MALE, {
		title: 'Male'
	}],
	[SexID.FEMALE, {
		title: 'Female'
	}]
]);
