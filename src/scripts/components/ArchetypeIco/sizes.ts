export enum SizeID {
	'default' = 'default',
	'large' = 'large'
}

type IArchetypeIcoSizes = {
	[size in SizeID]: string;
};

const ArchetypeIcoSizes: IArchetypeIcoSizes = {
	[SizeID.default]: 'Default',
	[SizeID.large]: 'Large'
};

export default ArchetypeIcoSizes;
