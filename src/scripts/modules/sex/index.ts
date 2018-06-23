import DataList from 'core/data-list';
import { SexID, ISexData } from 'modules/sex/types';

const Sexes = new DataList<SexID, ISexData>({
	[SexID.MALE]: {
		title: 'Male'
	},
	[SexID.FEMALE]: {
		title: 'Female'
	}
});

export default Sexes;
