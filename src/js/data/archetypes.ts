import { EPrimary } from 'models/primary';
import IArchetype from 'models/archetype';

interface IArchetypes {
	[archetype: string]: IArchetype;
}

const Archetypes: IArchetypes = {
	[EPrimary.P]: {
		title: 'Power'
	},
	[EPrimary.S]: {
		title: 'Speed'
	},
	[EPrimary.M]: {
		title: 'Magic'
	}
};

export default Archetypes;
