import { IArchetype, ArchetypeCharacteristicID as ArchCharID } from 'models/archetype';

const ArchetypeList: Map<ArchCharID, IArchetype> = new Map();

ArchetypeList.set(ArchCharID.P, {
	title: 'Power'
});

ArchetypeList.set(ArchCharID.S, {
	title: 'Speed'
});

ArchetypeList.set(ArchCharID.M, {
	title: 'Magic'
});

export default ArchetypeList;
