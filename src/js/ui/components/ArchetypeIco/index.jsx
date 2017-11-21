import React from 'react';
import sizes from 'ui/components/ArchetypeIco/sizes';
import archetypes from 'data/archetype';

const ArchetypeIco = ({ size, primary, secondary }) => {
	size = sizes[size] || sizes.default;
	primary = archetypes[primary] ? primary : Object.keys(archetypes)[0];
	secondary = archetypes[secondary] ? secondary : Object.keys(archetypes)[0];

	return (
		<span 
			className={`ArchetypeIco ArchetypeIco--primary${primary} ArchetypeIco--secondary${secondary} ArchetypeIco--size${size}`}
			title={`${primary}${secondary} Archetype (${archetypes[primary].title} + ${archetypes[secondary].title})`}
		></span>
	);
};

export default ArchetypeIco;
