import { PrimaryID } from 'models/primary';
import { IArchetype } from 'models/archetype';

interface IArchetypes {
	readonly [id: string]: IArchetype;
}

const Archetypes: IArchetypes = {
	[PrimaryID.P]: {
		title: 'Power'
	},
	[PrimaryID.S]: {
		title: 'Speed'
	},
	[PrimaryID.M]: {
		title: 'Magic'
	}
};

export default Archetypes;
