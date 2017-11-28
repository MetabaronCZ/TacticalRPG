import { IArchetype, ArchetypeCharacteristicID as ArchCharID } from 'models/archetype';

interface IArchetypes {
	readonly [id: string]: IArchetype;
}

const Archetypes: IArchetypes = {
	[ArchCharID.P]: {
		title: 'Power'
	},
	[ArchCharID.S]: {
		title: 'Speed'
	},
	[ArchCharID.M]: {
		title: 'Magic'
	}
};

export default Archetypes;
