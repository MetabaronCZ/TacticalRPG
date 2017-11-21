import armors from 'data/armor';

export const filter = char => {
	return Object.keys(armors).filter(arm => {
		return (
			!armors[arm].archetype ||
			armors[arm].archetype.includes(char.primary + char.secondary)
		);
	});
};
