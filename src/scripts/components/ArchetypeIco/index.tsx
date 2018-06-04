import React from 'react';

import { ArchCharID, Archetypes } from 'modules/archetype';
import ArchetypeIcoSizes, { SizeID } from 'components/ArchetypeIco/sizes';

interface IArchetypeIcoProps {
	size?: SizeID;
	primary?: ArchCharID;
	secondary?: ArchCharID;
}

const ArchetypeIco: React.SFC<IArchetypeIcoProps> = props => {
	const { size = SizeID.default, primary = ArchCharID.P, secondary = ArchCharID.P } = props;
	const sizeData = ArchetypeIcoSizes[size];
	const primaryData = Archetypes.get(primary);
	const secondaryData = Archetypes.get(secondary);
	const cls = `ArchetypeIco ArchetypeIco--primary${primary} ArchetypeIco--secondary${secondary} ArchetypeIco--size${sizeData}`;
	const title = `${primary}${secondary} Archetype (${primaryData ? primaryData.title : ''} + ${secondaryData ? secondaryData.title : ''})`;

	return <span className={cls} title={title} />;
};

export default ArchetypeIco;
