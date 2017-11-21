import characterClass from 'data/class';

export const filter = char => {
	return Object.keys(characterClass).filter(cls => {
		return (
			!characterClass[cls].archetype ||
			characterClass[cls].archetype.includes(char.primary + char.secondary)
		);
	});
};
