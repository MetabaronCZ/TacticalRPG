import DataList from 'core/data-list';

describe('core.DataList', () => {
	describe('#get()', () => {
		test('it returns correct item to given key', () => {
			type Keys = 'A' | 'B' | 'C';

			const list = new DataList<Keys, number>({
				A: 1, B: 2, C: 0
			});

			expect(list.get('A')).toEqual(1);
			expect(list.get('B')).toEqual(2);
			expect(list.get('C')).toEqual(0);

			const data = {
				A: { x: 'a' },
				B: { x: 'b' },
				C: { x: 'c' }
			};
			const list2 = new DataList<Keys, { x: string }>(data);
			expect(list2.get('A')).toEqual(data.A);
			expect(list2.get('B')).toEqual(data.B);
			expect(list2.get('C')).toEqual(data.C);
		});
	});

	describe('#keys()', () => {
		test('it returns empty array if input data is empty', () => {
			const list = new DataList({});
			const keys = list.keys();
			expect(keys.length).toEqual(0);
		});

		test('it returns correct input data keys', () => {
			const data: Array<[any, string[]]> = [
				[{ A: 1 }, /* >> */ ['A']],
				[{ E: 0, B: 1 }, /* >> */ ['B', 'E']],
				[{ d: 0, A: 1, C: 7 }, /* >> */ ['A', 'C', 'd']]
			];
			for (const [input, result] of data) {
				const list = new DataList(input);
				const keys = list.keys();
				expect(keys.sort()).toEqual(result.sort());
			}
		});
	});

	describe('#values()', () => {
		test('it returns empty array if input data is empty', () => {
			const list = new DataList({});
			const values = list.values();
			expect(values.length).toEqual(0);
		});

		test('it returns correct input data values', () => {
			const data: Array<[any, any[]]> = [
				[{ A: 1 }, /* >> */ [1]],
				[{ E: 0, B: 1 }, /* >> */ [0, 1]],
				[{ d: 0, A: 1, C: 7 }, /* >> */ [0, 1, 7]],
				[{ A: null, C: undefined }, /* >> */ [null, undefined]]
			];
			for (const [input, result] of data) {
				const list = new DataList(input);
				const values = list.values();
				expect(values.sort()).toEqual(result.sort());
			}
		});

		test('it handles object references correctly', () => {
			const data = {
				A: { x: 0 },
				B: { x: 1 },
				C: { x: 2 }
			};
			const list = new DataList(data);
			const values = list.values();
			expect(values.sort()).toEqual(Object.values(data).sort());
		});
	});

	describe('#entries()', () => {
		test('it returns empty array if input data is empty', () => {
			const list = new DataList({});
			const entries = list.entries();
			expect(entries.length).toEqual(0);
		});

		test('it returns correct input data entries as tuple', () => {
			const data: Array<[any, any[]]> = [
				[{ A: 1 }, /* >> */ [['A', 1]]],
				[{ E: 0, B: 1 }, /* >> */ [['E', 0], ['B', 1]]],
				[{ d: 0, A: 1, C: 7 }, /* >> */ [['d', 0], ['A', 1], ['C', 7]]],
				[{ A: null, C: undefined }, /* >> */ [['A', null], ['C', undefined]]]
			];
			for (const [input, result] of data) {
				const list = new DataList(input);
				const entries = list.entries();
				expect(entries.sort()).toEqual(result.sort());
			}
		});
	});

	describe('#map()', () => {
		test('it returns empty array if input data is empty', () => {
			const list = new DataList({});
			const mapped = list.map((key, value, i) => [key, value, i]);
			expect(mapped.length).toEqual(0);
		});

		test('it maps list entries according to given function', () => {
			const data = { A: 0, B: 1, C: 2 };
			const result1 = [0, 2, 4];
			const result2 = [{ x: 0 }, { x: 1 }, { x: 2 }];

			const list = new DataList(data);
			const mapped1 = list.map((key, value, i) => 2 * value);
			const mapped2 = list.map((key, value, i) => ({ x: i }));

			expect(mapped1.sort()).toEqual(result1.sort());
			expect(mapped2.sort()).toEqual(result2.sort());
		});
	});

	describe('#each()', () => {
		test('it does not execute given function if input is empty', () => {
			const list = new DataList({});
			const fn = jest.fn();
			expect(fn).toBeCalledTimes(0);

			list.each(fn);
			expect(fn).toBeCalledTimes(0);
		});

		test('it executes given function for every entry', () => {
			const data = { A: { x: 0 }, B: { x: 1 }, C: { x: 2 } };
			const result = [['A', data.A, 0], ['B', data.B, 1], ['C', data.C, 2]];

			const list = new DataList(data);
			const arr: Array<[string, any, number]> = [];

			list.each((key, value, i) => {
				arr.push([key, value, i]);
			});

			expect(arr.sort()).toEqual(result.sort());
		});
	});

	describe('#filter()', () => {
		test('it does not execute given function if input is empty', () => {
			const list = new DataList({});
			const fn = jest.fn();
			expect(fn).toBeCalledTimes(0);

			list.filter(fn);
			expect(fn).toBeCalledTimes(0);
		});

		test('it returns empty erray if input is empty', () => {
			const list = new DataList({});
			const res = list.filter(() => true);
			expect(res.length).toEqual(0);
		});

		test('it filters entries according to given function', () => {
			const data = { A: { x: 0 }, B: { x: 1 }, C: { x: 2 } };
			const list = new DataList(data);

			const res1 = list.filter((key, value, i) => 'A' === key);
			expect(res1).toEqual([['A', data.A]]);

			const res2 = list.filter((key, value, i) => value.x > 0);
			expect(res2).toEqual([['B', data.B], ['C', data.C]]);

			const res3 = list.filter((key, value, i) => i < 2);
			expect(res3).toEqual([['A', data.A], ['B', data.B]]);
		});
	});
});
