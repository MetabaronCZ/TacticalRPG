import Animation from 'core/animation';

describe('core.Animation', () => {
	test('it has valid initial state', () => {
		type Anim = 'A' | 'B';
		const anim = new Animation<Anim>('B', 1000, () => void(0));

		expect(anim.isRunning()).toEqual(false);
		expect(anim.getProgress()).toEqual(0);
		expect(anim.type).toEqual('B');
	});

	test('it runs only after Animation.start() is called', () => {
		const anim = new Animation(null, 1000, () => void(0));
		expect(anim.isRunning()).toEqual(false);

		anim.start();
		expect(anim.isRunning()).toEqual(true);

		anim.stop();
	});

	test('it cannot start while running', () => {
		const anim = new Animation(null, 1000, () => void(0));

		anim.start();
		expect(anim.start).toThrow();

		anim.stop();
	});

	test('it cannot be restarted when animation done', done => {
		const anim = new Animation(null, 1000, isLast => {
			if (isLast) {
				expect(anim.isRunning()).toEqual(false);
				expect(anim.start).toThrow();
				done();
			}
		});

		anim.start();
	});

	test('it runs onUpdate callback several times per second', done => {
		let calls = 0;

		const anim = new Animation(null, 1000, isLast => {
			calls++;

			if (isLast) {
				expect(calls).toBeGreaterThan(0);
				done();
			}
		});

		anim.start();
	});

	test('it reports valid animation progres', done => {
		const progress: number[] = [];

		const anim = new Animation(null, 1000, isLast => {
			progress.push(anim.getProgress());

			if (isLast) {
				expect(anim.getProgress()).toEqual(1);
				expect(progress.length).toBeGreaterThan(0);

				for (let i = 0, imax = progress.length; i < imax; i++) {
					const p = progress[i];
					expect(p).toBeGreaterThanOrEqual(0);
					expect(p).toBeLessThanOrEqual(1);

					if (i > 0) {
						expect(p).toBeGreaterThanOrEqual(progress[i - 1]);
					}
				}
				done();
			}
		});

		expect(anim.getProgress()).toEqual(0);
		anim.start();
	});

	test('it reports valid progress after given duration', done => {
		const duration = 500;
		const refreshRate = 60;
		const anim = new Animation(null, duration, () => void(0));

		anim.start();

		setTimeout(() => {
			const progress = anim.getProgress();
			expect(progress).toEqual(1);
			done();
		}, duration + refreshRate);
	});

	test('it stops animation with Animation.stop() called', done => {
		let calls = 0;
		let stopCalls = 0;
		let progress = 0;

		const anim = new Animation(null, 1000, () => {
			calls++;
		});

		anim.start();

		// stop animation and get current call count
		setTimeout(() => {
			expect(anim.isRunning()).toEqual(true);

			anim.stop();
			stopCalls = calls;
			progress = anim.getProgress();

			expect(anim.isRunning()).toEqual(false);
			expect(stopCalls).toBeGreaterThanOrEqual(0);
			expect(progress).toBeGreaterThanOrEqual(0);
		}, 200);

		// check call count after animation should have ended
		setTimeout(() => {
			expect(anim.isRunning()).toEqual(false);
			expect(calls).toEqual(stopCalls);
			expect(anim.getProgress()).toEqual(progress);

			done();
		}, 1100);
	});
});
