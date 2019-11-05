import Sequence, { ISequenceStep } from 'core/sequence';

jest.useFakeTimers();

describe('core.Sequence', () => {
	test('it throws if invalid timing given', () => {
		const fn = (): Sequence => {
			return new Sequence([], false, () => void(0));
		};
		expect(fn).toThrow();
	});

	test('it calls sequence step handler only after start method call', () => {
		const fn = jest.fn();
		const seq = new Sequence([0], false, fn);

		jest.runAllTimers();
		expect(fn).not.toBeCalled();

		seq.start();
		jest.runAllTimers();
		expect(fn).toBeCalledTimes(1);
	});

	test('it calls sequence step handler according to input', () => {
		const data = [
			[0],
			[0, 0, 10, 0],
			[10, 10, 10, 10]
		];

		for (const d of data) {
			const fn = jest.fn();
			const seq = new Sequence(d, false, fn);
			expect(fn).not.toBeCalled();

			seq.start();
			jest.runAllTimers();
			expect(fn).toBeCalledTimes(d.length);
		}
	});

	test('it provides correct step data in handler', () => {
		const data = [50, 0, 10, 35, 100];
		const steps: ISequenceStep[] = [];

		const seq = new Sequence(data, false, step => {
			steps.push(step);
		});

		seq.start();
		jest.runAllTimers();

		expect(steps.length).toEqual(data.length);

		steps.forEach((step, s) => {
			expect(step.number).toEqual(s);
			expect(step.max).toEqual(data.length);
			expect(step.duration).toEqual(data[s]);
			expect(step.isFirst).toEqual(0 === s);
			expect(step.isLast).toEqual(data.length - 1 === s);
		});
	});

	test('it calls sequence onEnd handler when sequence done', () => {
		const data = [
			[0],
			[0, 0, 10, 0],
			[10, 10, 10, 10]
		];

		for (const d of data) {
			const result: Array<number | string> = [];

			const onEnd = jest.fn(() => {
				result.push('END');
			});

			const seq = new Sequence(
				d,
				false,
				step => result.push(d[step.number]),
				onEnd
			);
			expect(onEnd).not.toBeCalled();

			seq.start();
			jest.runAllTimers();

			expect(onEnd).toBeCalledTimes(1);
			expect(result).toEqual([...d, 'END']);
		}
	});

	test('it can run asynchronously', () => {
		const data = [50, 0, 10, 35, 100];
		const steps: ISequenceStep[] = [];

		const seq = new Sequence(data, true, (step, next) => {
			steps.push(step);
			next();
		});

		seq.start();
		expect(steps.length).toEqual(data.length);
	});

	test('it does not run correctly if no callback called when async', () => {
		const data = [50, 0, 10, 35, 100];
		const steps: ISequenceStep[] = [];

		const seq = new Sequence(data, true, step => {
			steps.push(step);
		});

		seq.start();
		expect(steps.length).toEqual(1); // only first step called
	});
});
