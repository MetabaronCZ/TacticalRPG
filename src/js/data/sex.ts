import { SexID, ISex } from 'models/sex';

const Sex = new Map<SexID, ISex>([
	[SexID.MALE, {
		title: 'Male'
	}],
	[SexID.FEMALE, {
		title: 'Female'
	}]
]);

export default Sex;
