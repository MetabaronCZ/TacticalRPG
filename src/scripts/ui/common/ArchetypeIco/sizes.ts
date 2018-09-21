export type SizeID = 'default' | 'large';

type IArchetypeIcoSizes = {
	[size in SizeID]: string;
};

const ArchetypeIcoSizes: IArchetypeIcoSizes = {
	default: 'Default',
	large: 'Large'
};

export default ArchetypeIcoSizes;
