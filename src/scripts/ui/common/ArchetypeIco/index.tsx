import React from 'react';

import Archetypes from 'data/archetypes';
import { ArchetypeID } from 'engine/character/archetype';
import ArchetypeIcoSizes, { SizeID } from 'ui/common/ArchetypeIco/sizes';

interface IArchetypeIcoProps {
	readonly size?: SizeID;
	readonly archetype?: ArchetypeID;
}

const ArchetypeIco: React.SFC<IArchetypeIcoProps> = props => {
	const { size = SizeID.default, archetype = 'PP' } = props;
	const sizeData = ArchetypeIcoSizes[size];
	const archData = Archetypes.get(archetype);
	const cls = [
		'ArchetypeIco',
		`ArchetypeIco--size${sizeData}`,
		`ArchetypeIco--primary${archetype[0]}`,
		`ArchetypeIco--secondary${archetype[1]}`
	];
	return <span className={cls.join(' ')} title={`${archetype} Archetype (${archData.title})`} />;
};

export default ArchetypeIco;
