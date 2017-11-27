import React from 'react';
import sizes from 'ui/components/ArchetypeIco/sizes';
import Archetypes from 'data/archetypes';

const ArchetypeIco = ({ size, primary, secondary }) => {
	size = sizes[size] || sizes.default;
	primary = Archetypes[primary] ? primary : Object.keys(Archetypes)[0];
	secondary = Archetypes[secondary] ? secondary : Object.keys(Archetypes)[0];

	return (
		<span 
			className={`ArchetypeIco ArchetypeIco--primary${primary} ArchetypeIco--secondary${secondary} ArchetypeIco--size${size}`}
			title={`${primary}${secondary} Archetype (${Archetypes[primary].title} + ${Archetypes[secondary].title})`}
		></span>
	);
};

export default ArchetypeIco;
