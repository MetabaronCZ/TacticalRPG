import DataList from 'core/data-list';
import { SexID, ISexData } from 'modules/character/sex';

const Sexes = new DataList<SexID, ISexData>({
	MALE: {
		id: 'MALE',
		title: 'Male'
	},
	FEMALE: {
		id: 'FEMALE',
		title: 'Female'
	}
});

export default Sexes;
