import Animation, { IAnimationStep } from 'core/animation';

jest.useFakeTimers();

describe('core.Animation', () => {
	describe('#start()', () => {
		test('it throws if invalid timing given', () => {
			const fn = (): Animation => {
				return new Animation([], false, () => void(0));
			};
			expect(fn).toThrow();
		});

		test('it calls animation step handler only after start method call', () => {
			const fn = jest.fn();
			const anim = new Animation([0], false, fn);

			jest.runAllTimers();
			expect(fn).not.toBeCalled();

			anim.start();
			jest.runAllTimers();
			expect(fn).toBeCalledTimes(1);
		});

		test('it calls animation step handler according to input', () => {
			const data = [
				[0],
				[0, 0, 10, 0],
				[10, 10, 10, 10]
			];

			for (const d of data) {
				const fn = jest.fn();
				const anim = new Animation(d, false, fn);
				expect(fn).not.toBeCalled();

				anim.start();
				jest.runAllTimers();
				expect(fn).toBeCalledTimes(d.length);
			}
		});

		test('it provides correct step data in handler', () => {
			const data = [50, 0, 10, 35, 100];
			const steps: IAnimationStep[] = [];

			const anim = new Animation(data, false, step => {
				steps.push(step);
			});

			anim.start();
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

		test('it can run asynchronously', () => {
			const data = [50, 0, 10, 35, 100];
			const steps: IAnimationStep[] = [];

			const anim = new Animation(data, true, (step, next) => {
				steps.push(step);
				next();
			});

			anim.start();
			expect(steps.length).toEqual(data.length);
		});

		test('it does not run correctly if no callback called when async', () => {
			const data = [50, 0, 10, 35, 100];
			const steps: IAnimationStep[] = [];

			const anim = new Animation(data, true, step => {
				steps.push(step);
			});

			anim.start();
			expect(steps.length).toEqual(1); // only first step called
		});
	});
});
