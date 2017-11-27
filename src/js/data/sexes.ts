import { ESexes } from 'models/sexes';

interface ISexes {
	[sex: string]: string;
}

const Sexes: ISexes = {
	[ESexes.MALE]: 'Male',
	[ESexes.FEMALE]: 'Female'
};

export default Sexes;
