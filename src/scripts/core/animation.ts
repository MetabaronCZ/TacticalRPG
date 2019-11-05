type OnUpdate = (isLast: boolean) => void;

class Animation<T> {
	public readonly type: T;

	private readonly duration: number;
	private readonly onUpdate: OnUpdate;

	private done = false;
	private running = false;
	private startTime = 0;
	protected progress = 0;

	constructor(type: T, duration: number, onUpdate: OnUpdate) {
		this.type = type;
		this.duration = duration;
		this.onUpdate = onUpdate;
	}

	public isRunning(): boolean {
		return this.running;
	}

	public getProgress(): number {
		return this.progress;
	}

	public start(): void {
		if (this.done || this.running) {
			throw new Error('Animation already started!');
		}
		this.running = true;
		this.startTime = performance.now();

		this.animate(this.startTime);
	}

	public stop(): void {
		this.running = false;
		this.done = true;
	}

	private animate = (t: number): void => {
		if (this.done || !this.running) {
			return;
		}
		requestAnimationFrame(this.animate);

		const diff = Math.max(t - this.startTime, 0);
		const progress = Math.min(diff / this.duration, 1);
		const isLast = (1 === progress);

		this.progress = progress;

		if (isLast) {
			this.running = false;
			this.done = true;
		}
		this.onUpdate(isLast);
	}
}

export default Animation;
