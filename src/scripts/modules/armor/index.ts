import ArmorList from 'modules/armor/list';
import { ArmorID } from 'modules/armor/types';

const Armors = new ArmorList({
	[ArmorID.NONE]: {
		title: 'none',
		description: 'No armor equipped',
		physicalDefense: 1,
		magicalDefense: 1
	},
	[ArmorID.ROBE]: {
		title: 'Robe',
		description: '',
		physicalDefense: 25,
		magicalDefense: 75
	},
	[ArmorID.LIGHT]: {
		title: 'Light Armor',
		description: '',
		physicalDefense: 50,
		magicalDefense: 1
	},
	[ArmorID.HEAVY]: {
		title: 'Heavy Armor',
		description: '',
		physicalDefense: 75,
		magicalDefense: 25
	}
});

export default Armors;
