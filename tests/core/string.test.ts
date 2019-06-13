import { firstLetterToUpper } from 'core/string';

describe('core.string', () => {
	describe('#firstLetterToUpper()', () => {
		test('it returns same string with first letter capitalized', () => {
			const data: string[] = [
				'', 'test', 'TEST', 'Test', 'tEST'
			];
			for (const d of data) {
				const str = firstLetterToUpper(d);
				const firstLetter = str[0] || '';
				expect(str.toLowerCase()).toEqual(d.toLowerCase());
				expect(firstLetter).toEqual(firstLetter.toUpperCase());
			}
		});
	});
});
