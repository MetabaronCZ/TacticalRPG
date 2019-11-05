import Animation from 'core/animation';

import Skill from 'modules/skill';
import Character from 'modules/character';

type CharacterAnimationType = 'COMBAT' | 'REACTION';
type OnUpdate = (isLast: boolean) => void;

class SkillAnimation extends Animation<CharacterAnimationType> {
	public readonly source: Character;
	public readonly targets: Character[];

	constructor(type: CharacterAnimationType, source: Character, targets: Character[], skill: Skill, onUpdate: OnUpdate) {
		super(type, skill.animation.duration, isLast => this.update(isLast, onUpdate));

		this.source = source;
		this.targets = targets;

		for (const target of this.targets) {
			target.animation = this;
		}
		this.source.animation = this;
	}

	private update(isLast: boolean, onUpdate: OnUpdate): void {
		if (isLast) {
			for (const target of this.targets) {
				if (this === target.animation) {
					target.animation = null;
				}
			}
			if (this === this.source.animation) {
				this.source.animation = null;
			}
		}
		onUpdate(isLast);
	}
}

export default SkillAnimation;
