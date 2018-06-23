import ArmorList from 'modules/armor/list';
import { ArmorID } from 'modules/armor/types';

const Armors = new ArmorList({
	[ArmorID.NONE]: {
		title: 'none',
		description: 'No armor equipped'
	},
	[ArmorID.ROBE]: {
		title: 'Robe',
		description: ''
	},
	[ArmorID.LIGHT]: {
		title: 'Light Armor',
		description: ''
	},
	[ArmorID.HEAVY]: {
		title: 'Heavy Armor',
		description: ''
	}
});

export default Armors;
