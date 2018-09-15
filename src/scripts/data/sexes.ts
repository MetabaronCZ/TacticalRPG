import DataList from 'core/data-list';
import { SexID, ISexData } from 'engine/character/sex';

const Sexes = new DataList<SexID, ISexData>({
	MALE: {
		title: 'Male'
	},
	FEMALE: {
		title: 'Female'
	}
});

export default Sexes;
