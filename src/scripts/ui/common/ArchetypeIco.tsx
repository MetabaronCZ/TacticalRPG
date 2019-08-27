import React from 'react';

import Archetypes from 'data/archetypes';
import { ArchetypeID } from 'modules/character/archetype';

interface IArchetypeIcoProps {
	readonly archetype?: ArchetypeID;
}

const ArchetypeIco: React.SFC<IArchetypeIcoProps> = ({ archetype = 'PP' }) => {
	const archData = Archetypes.get(archetype);
	const cls = [
		'ArchetypeIco',
		`ArchetypeIco--primary${archetype[0]}`,
		`ArchetypeIco--secondary${archetype[1]}`
	];
	return (
		<span
			className={cls.join(' ')}
			title={`${archData.title} (${archetype} archetype)`}
		/>
	);
};

export default ArchetypeIco;
