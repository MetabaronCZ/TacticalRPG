import { SexID, ISex } from 'models/sex';

const SexList = new Map<SexID, ISex>();

SexList.set(SexID.MALE, {
	title: 'Male'
});

SexList.set(SexID.FEMALE, {
	title: 'Female'
});

export default SexList;
