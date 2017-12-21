import React from 'react';
import ArchetypeIcoSizes, { SizeID } from 'ui/components/ArchetypeIco/sizes';
import ArchetypeList from 'data/archetype-list';
import { ArchetypeCharacteristicID as ArchCharID, IArchetype } from 'models/archetype';

interface IArchetypeIcoProps {
	size?: SizeID;
	primary?: ArchCharID;
	secondary?: ArchCharID;
}

const ArchetypeIco = ({
	size = SizeID.default,
	primary = ArchCharID.P,
	secondary = ArchCharID.P
}: IArchetypeIcoProps): JSX.Element => {
	const sizeData: string = ArchetypeIcoSizes[size];
	const primaryData: IArchetype|undefined = ArchetypeList.get(primary);
	const secondaryData: IArchetype|undefined = ArchetypeList.get(secondary);
	const cls: string = `ArchetypeIco ArchetypeIco--primary${primary} ArchetypeIco--secondary${secondary} ArchetypeIco--size${sizeData}`;
	const title: string = `${primary}${secondary} Archetype (${primaryData ? primaryData.title : ''} + ${secondaryData ? secondaryData.title : ''})`;

	return <span className={cls} title={title} />;
};

export default ArchetypeIco;
