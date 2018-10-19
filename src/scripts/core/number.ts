// format number for display
export const formatNumber = (n: number): string => n.toLocaleString();

// get random integer between other integers
export const randomNumberBetween = (from: number, to: number) => {
	return Math.floor(Math.random() * (to - from + 1) + from);
};
