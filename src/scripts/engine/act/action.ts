import * as ArrayUtils from 'core/array';
import * as NumberUtils from 'core/number';
import Animation, { IAnimationStep } from 'core/animation';
import { skillAnimDuration, smallShieldBlock } from 'data/game-config';

import Damage from 'engine/damage';
import Position from 'engine/position';
import Direction from 'engine/direction';
import Character from 'engine/character';
import SkillUtils from 'engine/skill/utils';
import ActReaction from 'engine/act/reaction';
import StatusEffects from 'engine/status-effect';
import CharacterAction from 'engine/character-action';

export type ActActionState = 'INIT' | 'IDLE' | 'SELECTED' | 'REACTION' | 'ANIMATION' | 'DONE';
export type IOnActionInfo = (text: string, position: Position) => void;

class ActAction {
	private readonly actor: Character;
	private readonly characters: Character[] = [];
	private state: ActActionState = 'INIT';
	private action: CharacterAction|null = null;

	private reaction: ActReaction|null = null; // current reaction phase
	private reactions: ActReaction[] = []; // action reactor phases
	private area: Position[] = []; // skill range tiles
	private targets: Position[] = []; // targetable tiles
	private effectArea: Position[] = []; // targeted skill effect area
	private effectTarget: Position|null = null; // selected skill target
	private effectTargets: Character[] = []; // targeted skill affected characters

	constructor(actor: Character, characters: Character[]) {
		this.actor = actor;
		this.characters = characters;
	}

	public getState(): ActActionState {
		return this.state;
	}

	public getAction(): CharacterAction|null {
		return this.action;
	}

	public getArea(): Position[] {
		return this.area;
	}

	public getTargetable(): Position[] {
		return this.targets;
	}

	public getEffectArea(): Position[] {
		return this.effectArea;
	}

	public getEffectTarget(): Position|null {
		return this.effectTarget;
	}

	public getEffectTargets(): Character[] {
		return this.effectTargets;
	}

	public getReaction(): ActReaction|null {
		return this.reaction;
	}

	public getReactions(): ActReaction[] {
		return this.reactions;
	}

	public start(action: CharacterAction) {
		const { state, actor, characters } = this;

		if ('INIT' !== state) {
			throw new Error('Could not start action: invalid state ' + state);
		}

		if (!action.isActive() || !action.getSkills().length) {
			throw new Error('Could not start action: invalid action');
		}
		this.action = action;
		this.state = 'IDLE';

		// update actor values
		const skills = SkillUtils.getByID(action.getSkills());
		const skillAreas = skills.map(skill => SkillUtils.getTargetableArea(skill, actor.getPosition()));
		const targetable = ArrayUtils.getIntersection(skillAreas, pos => pos.getX() + '|' + pos.getY());
		const targets = SkillUtils.getTargets(actor, skills[0], characters, targetable);

		this.area = targetable;
		this.targets = targets;
	}

	public selectTarget(target: Position, cb: () => void) {
		const { state, actor, action, targets, characters } = this;

		if ('IDLE' !== state && 'SELECTED' !== state) {
			throw new Error('Could not select action target: invalid state ' + state);
		}

		if (null === action) {
			throw new Error('Could not select action target: invalid action');
		}

		if (!target.isContained(targets)) {
			// non-selctable action target
			return;
		}

		// get skill effect area
		const skills = SkillUtils.getByID(action.getSkills());

		if (!skills) {
			return;
		}
		this.state = 'SELECTED';

		const effectAreas = skills.map(s => SkillUtils.getEffectArea(s, actor.getPosition(), target));
		const effectArea = ArrayUtils.getIntersection(effectAreas, pos => pos.getX() + '|' + pos.getY());
		const effectTargets = SkillUtils.getEffectTargets(actor, skills[0], effectArea, characters);

		this.effectTarget = target;
		this.effectArea = effectArea;
		this.effectTargets = effectTargets;

		cb();
	}

	public confirm(onInfo: IOnActionInfo, onUpdate: () => void, onActionAnimation: (step: IAnimationStep) => void) {
		const { state, action, characters, effectTarget, effectTargets } = this;

		if ('SELECTED' !== state) {
			throw new Error('Could not confirm action: invalid state ' + state);
		}

		if (null === action || null === effectTarget || !effectTargets.length) {
			throw new Error('Could not confirm action: invalid action data');
		}
		this.state = 'REACTION';

		const obstacles = characters.map(char => char.getPosition());

		this.reactions = effectTargets.map((reactor, id) => {
			return new ActReaction(id, reactor, obstacles, () => {
				if (id + 1 >= this.reactions.length) {
					// go to skill animation
					this.animate(onInfo, step => {
						if (step.isLast) {
							this.state = 'DONE';
						}
						onActionAnimation(step);
					});

				} else {
					// go to next reaction phase
					this.reaction = this.reactions[id + 1];
					this.startReact();
				}
				onUpdate();
			});
		});

		this.reaction = this.reactions[0];
		this.startReact();
		onUpdate();
	}

	public pass(action: CharacterAction) {
		this.state = 'DONE';
		this.action = action;
	}

	public passReaction(action: CharacterAction) {
		const { state, reaction } = this;

		if ('REACTION' !== state) {
			throw new Error('Could not cancel reaction: invalid state ' + state);
		}

		if (!reaction) {
			throw new Error('Could not cancel reaction: invalid reaction');
		}
		reaction.pass(action);
	}

	private startReact() {
		const { state, actor, reaction } = this;

		if ('REACTION' !== state) {
			throw new Error('Could not start reaction: invalid state ' + state);
		}

		if (null === reaction) {
			throw new Error('Could not start reaction: invalid reaction');
		}
		const reactor = reaction.getReactor();

		// face character to skill target tile
		const dir = Direction.resolve(actor.getPosition(), reactor.getPosition());
		actor.setDirection(dir);
	}

	private animate(onInfo: IOnActionInfo, cb: (step: IAnimationStep) => void) {
		const { state, action, actor, effectArea, effectTargets } = this;

		if ('REACTION' !== state) {
			throw new Error('Could not run action animation: invalid state ' + state);
		}
		this.state = 'ANIMATION';

		if (!effectTargets.length || null === action) {
			throw new Error('Could not run action animation: invalid data');
		}
		const timing = Array(effectTargets.length).fill(skillAnimDuration);

		// animate skill action
		const skillAnim = new Animation(timing, step => {
			const target = effectTargets[step.number];

			if (!target.isDead()) {
				const targetPos = target.getPosition();

				if (targetPos.isContained(effectArea)) {
					if (target.getStatus().find(status => 'BLOCK_LARGE' === status.id)) {
						// target blocked attack with shield
						target.removeStatus('BLOCK_LARGE');
						onInfo('Blocked', targetPos);

					} else {
						// caclulate character changes
						let info: string[] = [];

						for (const skill of action.getSkills()) {
							const skillData = SkillUtils.getByID([skill])[0];
							const skillStatus = skillData.getStatus();
							let phyDmg = 0;
							let elmDmg = 0;

							// physical damage
							phyDmg = Damage.getPhysical(actor, target, skill);
							info.push(NumberUtils.format(phyDmg));

							// elemental damage
							if (skillData.getElementalDamage()) {
								elmDmg = Damage.getElemental(actor, target, skill);
								info.push(NumberUtils.format(elmDmg));
							}

							// status effects
							const effects = Damage.getStatusEffects(actor, target, skill);

							// apply skill damage / statuses to target
							target.applySkill(phyDmg + elmDmg, effects);

							if (target.isDead()) {
								info.push('Dead');
								break;

							} else if (skillStatus.length) {
								// add skill effects
								info = [...info, ...skillStatus.map(id => StatusEffects.get(id)().title)];
							}

							// show small shield block info
							if (-1 !== effects.indexOf('BLOCK_SMALL')) {
								target.removeStatus('BLOCK_SMALL');
								info.unshift(`Blocked (${smallShieldBlock})`);
							}
						}
						let infoTiming = Array(info.length).fill(0);
						infoTiming = infoTiming.map(i => NumberUtils.randomBetween(250, 350));

						const infoAnim = new Animation(infoTiming, infoStep => {
							onInfo(info[infoStep.number], targetPos);
						});

						infoAnim.start();
					}

				} else {
					// target evaded skill action
					onInfo('Evaded', targetPos);
				}
			}

			if (step.isLast) {
				actor.skillReduceAP(action.getCost());
			}

			cb(step);
		});

		// start animation
		skillAnim.start();
	}
}

export default ActAction;
