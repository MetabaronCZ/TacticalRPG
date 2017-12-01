import React from 'react';
import ArchetypeIcoSizes, { SizeID } from 'ui/components/ArchetypeIco/sizes';
import Archetypes from 'data/archetypes';
import { ArchetypeCharacteristicID as ArchCharID } from 'models/archetype';

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
	const primaryData = Archetypes[primary];
	const secondaryData = Archetypes[secondary];
	const cls: string = `ArchetypeIco ArchetypeIco--primary${primary} ArchetypeIco--secondary${secondary} ArchetypeIco--size${sizeData}`;
	const title: string = `${primary}${secondary} Archetype (${Archetypes[primary].title} + ${Archetypes[secondary].title})`;

	return <span className={cls} title={title} />;
};

export default ArchetypeIco;
