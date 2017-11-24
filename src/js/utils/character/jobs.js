import Jobs from 'data/jobs';

export const filter = char => {
	return Object.keys(Jobs).filter(cls => {
		return (
			!Jobs[cls].archetype ||
			Jobs[cls].archetype.includes(char.primary + char.secondary)
		);
	});
};
