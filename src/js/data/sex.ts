import { SexID, ISex } from 'models/sex';

interface ISexes {
	readonly [id: string]: ISex;
}

const Sexes: ISexes = {
	[SexID.MALE]: {
		title: 'Male'
	},
	[SexID.FEMALE]: {
		title: 'Female'
	}
};

export default Sexes;
