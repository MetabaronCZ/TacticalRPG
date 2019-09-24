export interface IAnimationStep {
	readonly number: number;
	readonly max: number;
	readonly duration: number;
	readonly isLast: boolean;
	readonly isFirst: boolean;
}

export type AnimationTiming = number[]; // step time intervals (in ms)
export type OnAnimationStep = (step: IAnimationStep, next: () => void) => void;
export type OnAnimationEnd = () => void;

class Animation {
	private readonly async: boolean;
	private readonly timing: AnimationTiming;
	private readonly onStep: OnAnimationStep;
	private readonly onEnd?: OnAnimationEnd;
	private readonly stepsCount: number;
	private currentStep = 0;

	constructor(timing: AnimationTiming, async: boolean, onStep: OnAnimationStep, onEnd?: OnAnimationEnd) {
		if (!timing.length) {
			throw new Error('Animation initialized with invalid timing');
		}
		this.async = async;
		this.timing = timing;
		this.stepsCount = timing.length;

		this.onStep = onStep;
		this.onEnd = onEnd;
	}

	public start(): void {
		this.step();
	}

	private step(): void {
		const async = this.async;
		const step = this.currentStep;
		const max = this.timing.length - 1;
		const duration = this.timing[step];

		const next = (): void => {
			if (step < max) {
				// run next step
				this.currentStep++;
				this.step();

			} else if (this.onEnd) {
				// animation end
				this.onEnd();
			}
		};

		this.onStep(
			{
				number: step,
				max: this.stepsCount,
				duration,
				isFirst: (0 === step),
				isLast: (max === step)
			},
			()=> {
				if (async) {
					next();
				}
			}
		);

		if (!async) {
			window.setTimeout(next, duration);
		}
	}
}

export default Animation;
