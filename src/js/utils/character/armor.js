import Armors from 'data/armors';

export const filter = char => {
	return Object.keys(Armors).filter(arm => {
		return (
			!Armors[arm].archetype ||
			Armors[arm].archetype.includes(char.primary + char.secondary)
		);
	});
};
