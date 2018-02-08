import { SexID, ISexData } from 'models/sex';

const sexData: Array<[SexID, ISexData]> = [
	[SexID.MALE, {
		title: 'Male'
	}],
	[SexID.FEMALE, {
		title: 'Female'
	}]
];

export default sexData;
