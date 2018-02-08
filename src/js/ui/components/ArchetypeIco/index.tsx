import React from 'react';
import ArchetypeIcoSizes, { SizeID } from 'ui/components/ArchetypeIco/sizes';
import { ArchCharID, Archetypes } from 'models/archetype';

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
	const sizeData = ArchetypeIcoSizes[size];
	const primaryData = Archetypes.get(primary);
	const secondaryData = Archetypes.get(secondary);
	const cls = `ArchetypeIco ArchetypeIco--primary${primary} ArchetypeIco--secondary${secondary} ArchetypeIco--size${sizeData}`;
	const title = `${primary}${secondary} Archetype (${primaryData ? primaryData.title : ''} + ${secondaryData ? secondaryData.title : ''})`;

	return <span className={cls} title={title} />;
};

export default ArchetypeIco;
