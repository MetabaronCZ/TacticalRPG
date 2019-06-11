// get random integer in interval <from, to> (including "from", "to")
export const randomNumberBetween = (from: number, to: number): number => {
	if (to < from) {
		throw new Error(`Could not find integer in interval from ${from} to ${to}`);
	}
	// handle float numbers
	from = Math.ceil(from);
	to = Math.floor(to);

	return Math.floor(Math.random() * (to - from + 1) + from);
};

// format number for display
export const formatNumber = (n: number): string => n.toLocaleString();

// format integer to fixed cipher count
export const formatInteger = (nr: number, ciphers: number): string => {
	if (nr < 0) {
		throw new Error('Input number must by non-negative');
	}
	if (Math.floor(nr) !== nr) {
		throw new Error('Input number must an integer');
	}
	const result = nr + '';

	if (result.length > ciphers) {
		throw new Error('Ciphers count should be at least input number ciphers count');
	}
	const fill = Array(ciphers - result.length).fill(0).join('');
	return fill + result;
};
