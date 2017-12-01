interface IArchetypeIcoSizes {
	[name: string]: string;
}

export enum SizeID {
	'default' = 'default',
	'large' = 'large'
}

const ArchetypeIcoSizes: IArchetypeIcoSizes = {
	[SizeID.default]: 'Default',
	[SizeID.large]: 'Large'
};

export default ArchetypeIcoSizes;
