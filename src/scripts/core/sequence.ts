export interface ISequenceStep {
	readonly number: number;
	readonly max: number;
	readonly duration: number;
	readonly isLast: boolean;
	readonly isFirst: boolean;
}

type SequenceTiming = number[]; // step time intervals (in ms)
type OnSequenceStep = (step: ISequenceStep, next: () => void) => void;
type OnSequenceEnd = () => void;

class Sequence {
	private readonly async: boolean;
	private readonly timing: SequenceTiming;
	private readonly onStep: OnSequenceStep;
	private readonly onEnd?: OnSequenceEnd;
	private readonly stepsCount: number;
	private currentStep = 0;

	constructor(timing: SequenceTiming, async: boolean, onStep: OnSequenceStep, onEnd?: OnSequenceEnd) {
		if (!timing.length) {
			throw new Error('Sequence initialized with invalid timing');
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
				// sequence end
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

export default Sequence;
