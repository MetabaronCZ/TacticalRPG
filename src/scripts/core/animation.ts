export interface IAnimationStep {
	readonly number: number;
	readonly max: number;
	readonly duration: number;
	readonly isLast: boolean;
	readonly isFirst: boolean;
}

type AnimationTiming = number[]; // step time intervals (in ms)
type AnimationHandler = (step: IAnimationStep) => void;

class Animation {
	private readonly timing: AnimationTiming;
	private readonly handler: AnimationHandler;
	private readonly stepsCount: number;
	private currentStep = 0;

	constructor(timing: AnimationTiming, handler: AnimationHandler) {
		if (!timing.length) {
			throw new Error('Animation initialized with invalid timing');
		}
		this.timing = timing;
		this.handler = handler;
		this.stepsCount = timing.length;
	}

	public start(): void {
		this.step();
	}

	private step(): void {
		const step = this.currentStep;
		const max = this.timing.length - 1;
		const duration = this.timing[step];

		this.handler({
			number: step,
			max: this.stepsCount,
			duration,
			isFirst: (0 === step),
			isLast: (max === step)
		});

		window.setTimeout(() => {
			if (step < max) {
				this.currentStep++;
				this.step();
			}
		}, duration);
	}
}

export default Animation;
