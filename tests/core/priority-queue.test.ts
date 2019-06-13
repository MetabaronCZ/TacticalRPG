import PriorityQueue from 'core/priority-queue';

describe('core.PriorityQueue', () => {
	describe('#size', () => {
		test('it returns correct size of PriorityQueue', () => {
			const q = new PriorityQueue();
			expect(q.size()).toEqual(0);

			q.push(0, 0);
			expect(q.size()).toEqual(1);

			q.push(1, 1);
			q.push(2, 0);
			expect(q.size()).toEqual(3);
		});
	});

	describe('#get', () => {
		test('it returns and removes first item of PriorityQueue', () => {
			const q = new PriorityQueue();
			expect(q.get()).toEqual(undefined);
			expect(q.size()).toEqual(0);

			q.push(1, 0);
			expect(q.get()).toEqual(1);
			expect(q.size()).toEqual(0);

			q.push(1, 1);
			q.push(2, 0);
			expect(q.get()).toEqual(2);
			expect(q.size()).toEqual(1);

			q.push(3, -1);
			expect(q.get()).toEqual(3);
			expect(q.size()).toEqual(1);
		});
	});

	describe('#push', () => {
		test('it adds an item to queue', () => {
			const q = new PriorityQueue();
			expect(q.size()).toEqual(0);

			for (let i = 0; i < 10; i++) {
				q.push(i, 1);
				expect(q.size()).toEqual(i + 1);
			}
		});

		test('it sorts items according to its priority', () => {
			const q = new PriorityQueue();

			// order of insertion
			q.push('B', 1);
			q.push('A', 0);
			expect(q.get()).toEqual('A');
			expect(q.get()).toEqual('B');

			// negative priority
			q.push('A', 0);
			q.push('B', -1);
			expect(q.get()).toEqual('B');
			expect(q.get()).toEqual('A');

			// insert between
			q.push('A', 0);
			q.push('B', 2);
			q.push('C', 1);
			expect(q.get()).toEqual('A');
			expect(q.get()).toEqual('C');
			expect(q.get()).toEqual('B');

			// equal priorities
			q.push('A', 0);
			q.push('B', 0);
			q.push('C', 0);
			expect(q.get()).toEqual('A');
			expect(q.get()).toEqual('B');
			expect(q.get()).toEqual('C');

			q.push('A', 0);
			q.push('B', 0);
			q.push('C', 1);
			q.push('D', 1);
			q.push('E', 1);
			expect(q.get()).toEqual('A');
			expect(q.get()).toEqual('B');
			expect(q.get()).toEqual('C');
			expect(q.get()).toEqual('D');
			expect(q.get()).toEqual('E');
		});
	});
});
