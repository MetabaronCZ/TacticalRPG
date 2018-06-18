import React from 'react';

import { Archetypes, ArchetypeID } from 'modules/archetype';
import ArchetypeIcoSizes, { SizeID } from 'components/ArchetypeIco/sizes';

interface IArchetypeIcoProps {
	size?: SizeID;
	archetype?: ArchetypeID;
}

const ArchetypeIco: React.SFC<IArchetypeIcoProps> = props => {
	const { size = SizeID.default, archetype = ArchetypeID.PP } = props;
	const sizeData = ArchetypeIcoSizes[size];
	const archData = Archetypes.get(archetype);
	const cls = `ArchetypeIco ArchetypeIco--primary${archetype[0]} ArchetypeIco--secondary${archetype[1]} ArchetypeIco--size${sizeData}`;
	const title = `${archetype} Archetype (${archData.title}`;

	return <span className={cls} title={title} />;
};

export default ArchetypeIco;
