// get random integer between other integers
export const randomNumberBetween = (from: number, to: number) => {
	return Math.floor(Math.random() * (to - from + 1) + from);
};

// format number for display
export const formatNumber = (n: number): string => n.toLocaleString();

// format integer to fixed cipher count
export const formatInteger = (nr: number, ciphers: number): string => {
	const result = nr + '';

	if (result.length > ciphers) {
		throw new Error('Ciphers count should be at least input number ciphers count');
	}
	const fill = Array(ciphers - result.length).fill(0).join('');
	return fill + result;
};
