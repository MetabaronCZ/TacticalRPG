import React from 'react';

import Archetypes from 'data/archetypes';
import { ArchetypeID } from 'modules/character/archetype';

type ArchetypeSize = 'default' | 'large';

type IArchetypeIcoSizes = {
	[size in ArchetypeSize]: string;
};

interface IArchetypeIcoProps {
	readonly size?: ArchetypeSize;
	readonly archetype?: ArchetypeID;
}

const ArchetypeIcoSizes: IArchetypeIcoSizes = {
	default: 'Default',
	large: 'Large'
};

const ArchetypeIco: React.SFC<IArchetypeIcoProps> = props => {
	const { size = 'default', archetype = 'PP' } = props;
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
