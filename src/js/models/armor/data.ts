import { ArchetypeID } from 'models/archetype';

export default interface IArmorData {
	readonly title: string;
	readonly description: string;
	readonly archetype: ArchetypeID[];
}
