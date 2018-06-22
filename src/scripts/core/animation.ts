interface IAnimationStep {
	readonly number: number;
	readonly duration: number;
	readonly isLast: boolean;
	readonly isFirst: boolean;
}

type AnimationTiming = number[]; // step time intervals (in ms)
type AnimationHandler = (step: IAnimationStep) => void;

class Animation {
	private readonly timing: AnimationTiming;
	private readonly handler: AnimationHandler;
	private currentStep = 0;

	constructor(timing: AnimationTiming, handler: AnimationHandler) {
		if (!timing.length || !handler) {
			throw new Error('Animation initialized with wrong arguments');
		}
		this.timing = timing;
		this.handler = handler;
	}

	public duration() {
		return this.timing.length;
	}

	public start() {
		this.step();
	}

	private step() {
		const step = this.currentStep;
		const max = this.duration() - 1;
		const duration = this.timing[step];

		this.handler({
			number: step + 1,
			duration,
			isFirst: (0 === step),
			isLast: (max === step)
		});

		setTimeout(() => {
			if (step < max) {
				this.currentStep++;
				this.step();
			}
		}, duration);
	}
}

export default Animation;
