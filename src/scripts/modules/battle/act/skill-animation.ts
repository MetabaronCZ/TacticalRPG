import Skill from 'modules/skill';
import Character from 'modules/character';

type CharacterAnimationType = 'COMBAT' | 'REACTION';

type OnEnd = () => void;
type OnUpdate = () => void;

class SkillAnimation {
	public readonly type: CharacterAnimationType;

	private readonly targets: Character[];
	private readonly duration: number;
	private readonly onEnd: OnEnd;
	private readonly onUpdate: OnUpdate;

	private done = false;
	private running = false;
	private startTime = 0;
	private progress = 0;

	constructor(type: CharacterAnimationType, targets: Character[], skill: Skill, onUpdate: OnUpdate, onEnd: OnEnd) {
		this.type = type;
		this.targets = targets;
		this.duration = skill.animation.duration;

		this.onEnd = onEnd;
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
			throw new Error('Skill animation already started!');
		}
		this.running = true;
		this.startTime = performance.now();

		for (const target of this.targets) {
			target.animation = this;
		}
		this.animate(this.startTime);
	}

	private animate = (t: number): void => {
		if (this.done || !this.running) {
			return;
		}
		requestAnimationFrame(this.animate);

		const diff = Math.max(t - this.startTime, 0);
		const progress = Math.min(diff / this.duration, 1);
		const isLast = (1 === progress);

		if (progress < 0) {
			console.log('-', diff, this.duration, progress);
		}

		this.progress = progress;
		this.onUpdate();

		if (isLast) {
			this.running = false;
			this.done = true;

			for (const target of this.targets) {
				if (this === target.animation) {
					target.animation = null;
				}
			}
			this.onEnd();
		}
	}
}

export default SkillAnimation;
