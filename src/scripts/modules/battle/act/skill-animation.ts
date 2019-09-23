import Animation, { IAnimationStep } from 'core/animation';

import Skill from 'modules/skill';
import Character from 'modules/character';

type OnEnd = () => void;
type OnUpdate = (step: IAnimationStep) => void;

class SkillAnimation {
	private readonly animation: Animation
	private done = false;

	constructor(actor: Character, skill: Skill, onUpdate: OnUpdate, onEnd: OnEnd) {
		this.animation = new Animation(
			[skill.animation.duration],
			false,
			step => onUpdate(step),
			() => {
				this.done = true;
				onEnd();
			}
		);
	}

	public start(): void {
		if (this.done) {
			return;
		}
		this.animation.start();
	}
}

export default SkillAnimation;
