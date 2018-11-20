export const letters: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

export const firstLetterToUpper = (str: string) => {
	if (!str.length) {
		return str;
	}
	return str.charAt(0).toUpperCase() + str.slice(1);
};
