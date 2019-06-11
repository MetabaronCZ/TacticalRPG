import { getRandomItem, getUniqueItems, getRandomized, getIntersection } from 'core/array';

describe('core.array', () => {
	describe('#getUniqueItems', () => {
		const data = [
			[[5], /* >> */ [5]],
			[[1, 1, 1, 1, 1], /* >> */ [1]],
			[['A', 'B', 'A', 'B', 'A'], /* >> */ ['A', 'B']],
			[[1, 2, 3, 4, 5, 0], /* >> */ [0, 1, 2, 3, 4, 5]],
			[[1, 2, 1, 0, 3, 'A'], /* >> */ [0, 1, 2, 3, 'A']],
			[[1, 1, 0, 1, 1, 0], /* >> */ [0, 1]],
			[[null, 0, 1, undefined, 5], /* >> */ [null, undefined, 0, 1, 5]],
			[[null, 1, null], /* >> */ [null, 1]]
		];

		test('it returns empty array if input is empty', () => {
			const items = getUniqueItems([]);
			expect(items.length).toEqual(0);
		});

		test('it returns only unique values', () => {
			for (const d of data) {
				const [arr, result] = d;
				const items = getUniqueItems(arr);
				expect(items.sort()).toEqual(result.sort());
			}
		});
	});

	describe('#getRandomItem', () => {
		const data = [0, 1, -1, 'A', [1, 2, 3], undefined, null];

		test('it returns null when array is empty', () => {
			const item = getRandomItem([]);
			expect(item).toEqual(null);
		});

		test('it returns one item from array', () => {
			let attempts = 10;

			while (attempts > 0) {
				const item = getRandomItem(data);
				expect(data).toContain(item);
				attempts--;
			}
		});
	});

	describe('#getRandomized', () => {
		const data: any[][] = [
			[],
			[1],
			[1,2,3],
			[null, undefined, 0, ''],
			[{ x: 1 }, { x: 2 }, { x: 3 }, { x: 0 }]
		];

		test('it returns unique array of same length as the input', () => {
			for (const d of data) {
				const ran = getRandomized(d);
				expect(ran === d).toBeFalsy();
				expect(ran.length).toEqual(d.length);
			}
		});

		test('it returns same items as input, nothing more', () => {
			for (const d of data) {
				const ran = getRandomized(d);

				for (const item of ran) {
					expect(d).toContain(item);
				}

				for (const item of d) {
					expect(ran).toContain(item);
				}
			}
		});
	});

	describe('#getIntersection', () => {
		test('it returns empty array if no input given', () => {
			const result = getIntersection([]);
			expect(result.length).toEqual(0);
		});

		test('it returns all items of a single input array', () => {
			const data: any[][] = [
				[],
				[1],
				[[]],
				[1, 2, 3],
				['A'],
				[null]
			];
			for (const d of data) {
				const result = getIntersection([d]);
				expect(result === d).toBeFalsy();
				expect(result.sort()).toEqual(d.sort());
			}
		});

		test('it returns empty array if input arrays have no common items', () => {
			const data = [
				[[]],
				[[], []],
				[[1, 2, 3], []],
				[[1], [2], [3]],
				[[1, 2, 4], [3]],
				[[1, 2], [2, 3], [0]],
				[[1], [1, 2], [1, 2, 3], [2, 3]],
				[[0], [null], [undefined, 1]],
				[[null], [undefined]]
			];
			for (const d of data) {
				const result = getIntersection(d);
				expect(result.length).toEqual(0);
			}
		});

		test('it returns common items of given input arrays', () => {
			const data: any[][][] = [
				[[[1], [1]], /* >> */ [1]],
				[[[0], [0, 1]], /* >> */ [0]],
				[[[0, 1], [1, 2]], /* >> */ [1]],
				[[[1, 2], [2, 1]], /* >> */ [1, 2]],
				[[[1, 1, 1, 2], [1, 2, 2, 2]], /* >> */ [1, 2]],
				[[[1, 2, 3, 4, 5], [5, 4, 3, 2, 1, 0]], /* >> */ [1, 2, 3, 4, 5]]
			];
			for (const [input, result] of data) {
				const items = getIntersection(input);
				expect(items === input).toBeFalsy();
				expect(items.sort()).toEqual(result.sort());
			}
		});

		test('it returns common items in right counts', () => {
			const data: any[][][] = [
				[[[1], [1]], /* >> */ [1]],
				[[[1, 1], [1]], /* >> */ [1]],
				[[[1, 1], [1, 1]], /* >> */ [1, 1]],
				[[[1, 1, 2], [1, 2, 2]], /* >> */ [1, 2]],
				[[[1, 1, 2], [1, 2, 1]], /* >> */ [1, 1, 2]],
				[[[0, 1, 2], [1, 2, 3]], /* >> */ [1, 2]],
				[[[1, 1, 2, 2], [1, 2, 2, 2]], /* >> */ [1, 2, 2]],
				[[[0, 1, 1, 1, 2, 2], [0, 0, 1, 1, 2, 2, 2]], /* >> */ [0, 1, 1, 2, 2]]
			];
			for (const [input, result] of data) {
				const items = getIntersection(input);
				expect(items.sort()).toEqual(result.sort());
			}
		});
	});
});
