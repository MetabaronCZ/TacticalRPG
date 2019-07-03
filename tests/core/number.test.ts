import { randomNumberBetween, formatNumber, formatInteger } from 'core/number';

describe('core.number', () => {
	describe('#randomNumberBetween()', () => {
		test('it throws error when "from" is greater than "to"', () => {
			const fn = () => randomNumberBetween(10, 1);
			expect(fn).toThrowError();
		});

		test('it returns integer in given interval (including bounds)', () => {
			const data: Array<[number, number]> = [
				[1, 1], [0, 1], [0, 10],
				[-6, -6], [-10, -1], [-5, 5],
				[0.1, 5.85]
			];
			let repeat = 5;

			for (const [from, to] of data) {
				while (repeat) {
					const nr = randomNumberBetween(from, to);
					expect(nr).toBeGreaterThanOrEqual(from);
					expect(nr).toBeLessThanOrEqual(to);
					expect(Math.floor(nr)).toEqual(nr);
					repeat--;
				}
			}
		});
	});

	describe('#formatNumber()', () => {
		test('it returns correctly formatted number as string', () => {
			const data: Array<[number, string]> = [
				[0, '0'], [1, '1'], [2178, '2,178'], [15001, '15,001'], [17528798, '17,528,798'],
				[-1, '-1'], [-126, '-126'], [-32179, '-32,179'], [-625890120, '-625,890,120'],
				[0.1, '0.1'], [-0.1, '-0.1'], [-1.015, '-1.015'],
				[-98000510.145, '-98,000,510.145']
			];
			for (const [input, result] of data) {
				const nr = formatNumber(input);
				expect(nr).toEqual(result);
			}
		});

		test('it rounds float numbers to three decimal digits', () => {
			const data: Array<[number, string]> = [
				[0.0001, '0'],
				[0.001, '0.001'],
				[0.0015, '0.002'],
				[-8.1234, '-8.123'],
				[-8.1235, '-8.124']
			];
			for (const [input, result] of data) {
				const nr = formatNumber(input);
				expect(nr).toEqual(result);
			}
		});
	});

	describe('#formatInteger()', () => {
		const fn = (i: number, c: number) => () => formatInteger(i, c);

		test('it throws if input cipher count is bigger than requested', () => {
			expect(fn(100, 1)).toThrowError();
			expect(fn(100, 2)).toThrowError();
			expect(fn(100, 3)).not.toThrowError();
			expect(fn(100, 4)).not.toThrowError();
		});

		test('it throws if input is a negative number', () => {
			expect(fn(-1, 1)).toThrowError();
			expect(fn(-1, 2)).toThrowError();
			expect(fn(-58, 1)).toThrowError();
			expect(fn(-58, 2)).toThrowError();
			expect(fn(-58, 3)).toThrowError();
		});

		test('it throws if input is a float', () => {
			expect(fn(0.1, 1)).toThrowError();
			expect(fn(0.1, 2)).toThrowError();
			expect(fn(0.1, 3)).toThrowError();
		});

		test('it correctly prepends input with zeros by default', () => {
			const data: Array<[number, number, string]> = [
				[0, 1, '0'], [0, 2, '00'],
				[7, 1, '7'], [7, 2, '07'], [7, 5, '00007'],
				[1100, 4, '1100'], [1100, 5, '01100'], [1100, 6, '001100']
			];
			for (const [input, cipher, result] of data) {
				const nr = formatInteger(input, cipher);
				expect(nr).toEqual(result);
			}
		});

		test('it correctly prepends input with given character', () => {
			const data: Array<[number, number, string, string]> = [
				[0, 1, '+', '0'],
				[0, 2, '+', '+0'],
				[12, 4, 'U', 'UU12']
			];
			for (const [input, cipher, char, result] of data) {
				const nr = formatInteger(input, cipher, char);
				expect(nr).toEqual(result);
			}
		});
	});
});
