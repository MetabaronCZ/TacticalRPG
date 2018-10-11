import * as ArrayUtils from 'core/array';
import * as NumberUtils from 'core/number';
import Animation, { IAnimationStep } from 'core/animation';

import StatusEffects from 'data/status-effects';
import { skillAnimDuration, smallShieldBlock } from 'data/game-config';

import Logger from 'engine/logger';
import Character from 'engine/character';
import Position from 'engine/battle/position';
import ActReaction from 'engine/battle/act/reaction';
import CharacterAction from 'engine/battle/character-action';
import { resolveDirection } from 'engine/utils/direction';
import { getPhysicalDamage, getElementalDamage, getStatusEffects } from 'engine/battle/damage';

interface IActActionEvents {
	onStart: (action: ActAction) => void;
	onReset: (action: ActAction) => void;
	onSelect: (action: ActAction) => void;
	onConfirm: (action: ActAction) => void;
	onPass: (action: ActAction) => void;
	onAnimation: (action: ActAction, step: IAnimationStep) => void;

	onReactionStart: (reaction: ActReaction) => void;
	onReactionSelected: (reaction: ActReaction) => void;
	onReactionBlock: (reaction: ActReaction) => void;
	onReactionEvasionStart: (reaction: ActReaction) => void;
	onReactionEvasionEnd: (reaction: ActReaction) => void;
	onReactionPass: (reaction: ActReaction) => void;
	onReactionReset: (reaction: ActReaction) => void;
	onReactionEnd: (reaction: ActReaction) => void;

	onBattleInfo: (text: string, position: Position) => void;
}

export type ActActionState = 'INIT' | 'IDLE' | 'SELECTED' | 'CONFIRMED' | 'REACTION' | 'ANIMATION' | 'DONE';
export type IOnActionInfo = (text: string, position: Position) => void;

class ActAction {
	private readonly actor: Character;
	private readonly characters: Character[] = [];
	private readonly events: IActActionEvents;

	private state: ActActionState = 'INIT';
	private action: CharacterAction|null = null;
	private reaction: ActReaction|null = null; // current reaction phase
	private reactions: ActReaction[] = []; // action reactor phases
	private area: Position[] = []; // skill range tiles
	private targets: Position[] = []; // targetable tiles
	private effectArea: Position[] = []; // targeted skill effect area
	private effectTarget: Position|null = null; // selected skill target
	private effectTargets: Character[] = []; // targeted skill affected characters

	constructor(actor: Character, characters: Character[], events: IActActionEvents) {
		this.actor = actor;
		this.characters = characters;
		this.events = this.prepareEvents(events);
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

		if (!action.isActive() || !action.skills.length) {
			throw new Error('Could not start action: invalid action');
		}
		this.action = action;
		this.state = 'IDLE';

		// update actor values
		const skills = action.skills;
		const skillAreas = skills.map(skill => skill.getTargetable(actor.position));
		const targetable = ArrayUtils.getIntersection(skillAreas, pos => pos.id);
		const targets = skills[0].getTargets(actor, characters, targetable);

		this.area = targetable;
		this.targets = targets;

		this.events.onStart(this);
	}

	public selectTarget(target: Position) {
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
		const skills = action.skills;

		if (!skills.length) {
			return;
		}
		this.state = 'SELECTED';

		const effectAreas = skills.map(s => s.getEffectArea(actor.position, target));
		const effectArea = ArrayUtils.getIntersection(effectAreas, pos => pos.id);
		const effectTargets = skills[0].getEffectTargets(actor, effectArea, characters);

		this.effectTarget = target;
		this.effectArea = effectArea;
		this.effectTargets = effectTargets;

		this.events.onSelect(this);
	}

	public confirm() {
		const { state, action, characters, effectTarget, effectTargets, events } = this;

		if ('SELECTED' !== state) {
			throw new Error('Could not confirm action: invalid state ' + state);
		}

		if (null === action || null === effectTarget || !effectTargets.length) {
			throw new Error('Could not confirm action: invalid action data');
		}
		this.state = 'CONFIRMED';

		const obstacles = characters.map(char => char.position);

		this.reactions = effectTargets.map((reactor, id) => {
			return new ActReaction(id, reactor, obstacles, {
				onStart:			reaction => events.onReactionStart(reaction),
				onReactionSelected:	reaction => events.onReactionSelected(reaction),
				onBlock:			reaction => events.onReactionBlock(reaction),
				onEvasionStart:		reaction => events.onReactionEvasionStart(reaction),
				onEvasionEnd:		reaction => events.onReactionEvasionEnd(reaction),
				onPass:				reaction => events.onReactionPass(reaction),
				onReset:			reaction => events.onReactionReset(reaction),
				onEnd: reaction => {
					events.onReactionEnd(reaction);

					if (id + 1 >= this.reactions.length) {
						// go to skill animation
						this.animate();
					} else {
						// go to next reaction
						this.startReact(id + 1);
					}
				}
			});
		});

		this.events.onConfirm(this);

		this.state = 'REACTION';
		this.startReact(0);
	}

	public pass(passAction: CharacterAction) {
		this.state = 'DONE';
		this.action = passAction;
		this.events.onPass(this);
	}

	public passReaction(passAction: CharacterAction) {
		const { state, reaction } = this;

		if ('REACTION' !== state) {
			throw new Error('Could not cancel reaction: invalid state ' + state);
		}

		if (!reaction) {
			throw new Error('Could not cancel reaction: invalid reaction');
		}
		reaction.pass(passAction);
	}

	public reset() {
		this.state = 'INIT';
		this.action = null;
		this.reaction = null;
		this.reactions = [];
		this.area = [];
		this.targets = [];
		this.effectArea = [];
		this.effectTarget = null;
		this.effectTargets = [];

		this.events.onReset(this);
	}

	private startReact(id: number) {
		const { state, actor } = this;

		if ('REACTION' !== state) {
			throw new Error('Could not start reaction: invalid state ' + state);
		}
		const reaction = this.reactions[id];

		if (null === reaction) {
			throw new Error('Could not start reaction: invalid reaction');
		}
		this.reaction = reaction;

		// face character to skill target tile
		const reactor = reaction.getReactor();
		actor.direction = resolveDirection(actor.position, reactor.position);

		reaction.start();
	}

	private animate() {
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
				const targetPos = target.position;

				if (targetPos.isContained(effectArea)) {
					if (target.status.has('BLOCK_LARGE')) {
						// target blocked attack with shield
						target.status.remove('BLOCK_LARGE');
						this.events.onBattleInfo('Blocked', targetPos);

					} else {
						// caclulate character changes
						let info: string[] = [];

						for (const skill of action.skills) {
							const skillStatus = skill.status;
							let phyDmg = 0;
							let elmDmg = 0;

							// physical damage
							phyDmg = getPhysicalDamage(actor, target, skill);
							info.push(NumberUtils.format(phyDmg));

							// elemental damage
							if (skill.elementalDamage) {
								elmDmg = getElementalDamage(actor, target, skill);
								info.push(NumberUtils.format(elmDmg));
							}

							// status effects
							const effects = getStatusEffects(actor, target, skill);

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
								target.status.remove('BLOCK_SMALL');
								info.unshift(`Blocked (${smallShieldBlock})`);
							}
						}
						let infoTiming = Array(info.length).fill(0);
						infoTiming = infoTiming.map(i => NumberUtils.randomBetween(250, 350));

						const infoAnim = new Animation(infoTiming, infoStep => {
							this.events.onBattleInfo(info[infoStep.number], targetPos);
						});

						infoAnim.start();
					}

				} else {
					// target evaded skill action
					this.events.onBattleInfo('Evaded', targetPos);
				}
			}

			if (step.isLast) {
				this.state = 'DONE';
				actor.skillReduceAP(action.cost);
			}

			this.events.onAnimation(this, step);
		});

		// start animation
		skillAnim.start();
	}

	private prepareEvents(events: IActActionEvents): IActActionEvents {
		return {
			onStart: (action: ActAction) => {
				const actionItem = action.action;
				Logger.info(`ActAction onStart: "${actionItem ? actionItem.title : '-'}"`);
				events.onStart(action);
			},
			onReset: (action: ActAction) => {
				Logger.info('ActAction onReset');
				events.onReset(action);
			},
			onSelect: (action: ActAction) => {
				const tgt = action.getEffectTarget();
				Logger.info(`ActMove onSelect: "${tgt ? `(${tgt.x}, ${tgt.y})` : '-'}"`);
				events.onSelect(action);
			},
			onConfirm: (action: ActAction) => {
				const actionItem = action.getAction();
				Logger.info(`ActMove onConfirm: "${actionItem ? actionItem.title : '-'}"`);
				events.onConfirm(action);
			},
			onPass: (action: ActAction) => {
				Logger.info('ActAction onPass');
				events.onPass(action);
			},
			onAnimation: (action: ActAction, step: IAnimationStep) => {
				Logger.info(`ActAction onAnimation: "${step.number + 1}/${step.max}"`);
				events.onAnimation(action, step);
			},
			onReactionStart: events.onReactionStart,
			onReactionSelected: events.onReactionSelected,
			onReactionBlock: events.onReactionBlock,
			onReactionEvasionStart: events.onReactionEvasionStart,
			onReactionEvasionEnd: events.onReactionEvasionEnd,
			onReactionPass: events.onReactionPass,
			onReactionReset: events.onReactionReset,
			onReactionEnd: events.onReactionEnd,
			onBattleInfo: (text: string, pos: Position) => {
				Logger.info(`ActAction onBattleInfo: "${text}" (${pos.x}, ${pos.y})`);
				events.onBattleInfo(text, pos);
			}
		};
	}
}

export default ActAction;
