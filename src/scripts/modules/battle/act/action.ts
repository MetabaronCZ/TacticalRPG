import StatusEffects from 'data/status-effects';
import { skillAnimDuration } from 'data/game-config';

import Animation, { IAnimationStep } from 'core/animation';
import { getIntersection, getRandomItem } from 'core/array';
import { formatNumber, randomNumberBetween } from 'core/number';

import Logger from 'modules/logger';
import Character from 'modules/character';
import Position from 'modules/geometry/position';
import ActReaction from 'modules/battle/act/reaction';
import { IBattleInfo } from 'modules/battle/battle-info';
import CharacterAction from 'modules/battle/character-action';
import { resolveDirection } from 'modules/geometry/direction';
import { getDamageInfo, isBackAttack } from 'modules/battle/damage';

interface IActActionEvents {
	onStart: (action: ActAction) => void;
	onReset: (action: ActAction) => void;
	onSelect: (action: ActAction) => void;
	onConfirm: (action: ActAction) => void;
	onPass: (action: ActAction) => void;
	onAnimation: (action: ActAction, step: IAnimationStep) => void;
	onEnd: (action: ActAction) => void;

	onReactionStart: (reaction: ActReaction) => void;
	onReactionSelected: (reaction: ActReaction) => void;
	onReactionBlock: (reaction: ActReaction) => void;
	onReactionEvasionStart: (reaction: ActReaction) => void;
	onReactionEvasionEnd: (reaction: ActReaction) => void;
	onReactionPass: (reaction: ActReaction) => void;
	onReactionReset: (reaction: ActReaction) => void;
	onReactionEnd: (reaction: ActReaction) => void;

	onBattleInfo: (info: IBattleInfo, position: Position) => void;
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
		const targetable = getIntersection(skillAreas, pos => pos.id);
		const targets = skills[0].getTargets(actor, characters, targetable);

		this.area = targetable;
		this.targets = targets.map(char => char.position);

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
		const effectArea = getIntersection(effectAreas, pos => pos.id);
		const effectTargets = skills[0].getTargets(actor, characters, effectArea);

		this.effectTarget = target;
		this.effectArea = effectArea;
		this.effectTargets = effectTargets;

		this.events.onSelect(this);
	}

	public confirm() {
		const { actor, state, action, characters, effectTarget, effectTargets, events } = this;

		if ('SELECTED' !== state) {
			throw new Error('Could not confirm action: invalid state ' + state);
		}

		if (null === action || null === effectTarget || !effectTargets.length) {
			throw new Error('Could not confirm action: invalid action data');
		}
		this.state = 'CONFIRMED';

		const reactableSkills = action.skills.filter(skill => skill.isReactable());

		if (reactableSkills.length) {
			const obstacles = characters.map(char => char.position);

			this.reactions = effectTargets.map((reactor, id) => {
				const isBackAttacked = isBackAttack(actor, reactor);

				return new ActReaction(id, reactor, isBackAttacked, obstacles, {
					onStart:			reaction => events.onReactionStart(reaction),
					onSelected:			reaction => events.onReactionSelected(reaction),
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
							this.startReact(this.reactions[id + 1]);
						}
					}
				});
			});
		}
		this.events.onConfirm(this);

		this.state = 'REACTION';

		if (this.reactions.length) {
			this.startReact(this.reactions[0]);
		} else {
			this.animate();
		}
	}

	public pass(passAction: CharacterAction) {
		this.state = 'DONE';
		this.action = passAction;
		this.events.onPass(this);
		this.events.onEnd(this);
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

	private startReact(reaction: ActReaction) {
		const { state, actor } = this;

		if ('REACTION' !== state) {
			throw new Error('Could not start reaction: invalid state ' + state);
		}
		this.reaction = reaction;

		// face character to skill target tile
		const reactor = reaction.getReactor();
		actor.direction = resolveDirection(actor.position, reactor.position);

		reaction.start();
	}

	private animate() {
		const { state, action, actor, effectArea, effectTargets, events } = this;

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

				const info: IBattleInfo[] = [];

				if (!targetPos.isContained(effectArea)) {
					// target evaded skill action
					info.push({
						text: 'Evaded',
						type: 'ACTION',
						position: targetPos
					});

				} else {
					// caclulate character changes
					for (const skill of action.skills) {
						if ('ALLY' === skill.target) {
							switch (skill.id) {
								case 'WHITE_MAGIC_REMEDY': {
									// remove one bad status
									const statuses = target.status.get().filter(s => 'SUPPORT' !== s.type);
									const status = getRandomItem(statuses);

									if (null !== status) {
										target.status.remove(status.id);
									}
									info.push({
										text: `${status ? status.title : 'No'} status healed`,
										type: 'HEALING',
										position: targetPos
									});
									break;
								}

								case 'WHITE_MAGIC_REVIVE': {
									// TODO: revive death target ONCE
									break;
								}

								default: {
									// apply healing to target
									const magBonus = actor.mainHand.magic + actor.offHand.magic;
									const healing = (actor.attributes.MAG + magBonus) * skill.elementalDamage;
									target.applyHealing(healing, skill.status);

									info.push({
										text: formatNumber(healing),
										type: 'HEALING',
										position: targetPos
									});

									for (const id of skill.status) {
										info.push({
											text: StatusEffects.get(id)().title,
											type: 'BUFF',
											position: targetPos
										});
									}
								}
							}
							continue;
						}

						if (target.status.has('BLOCK_LARGE')) {
							// target completely blocked attack with shield
							target.status.remove('BLOCK_LARGE');

							info.push({
								text: 'Blocked',
								type: 'ACTION',
								position: targetPos
							});
							continue;
						}
						const damage = getDamageInfo(actor, target, skill);
						const damageStatus = damage.status.map(status => status.id);

						// show small shield block info
						if (damage.blockModifier) {
							target.status.remove('BLOCK_SMALL');

							info.push({
								text: `Blocked (${(damage.blockModifier * 100).toFixed(0)}%)`,
								type: 'ACTION',
								position: targetPos
							});
						}

						if (1 !== damage.directionModifier && !info.find(i => 'Back attack' === i.text)) {
							info.push({
								text: 'Back attack',
								type: 'ACTION',
								position: targetPos
							});
						}

						// physical damage
						info.push({
							text: formatNumber(damage.physical),
							type: 'DAMAGE',
							position: targetPos
						});

						// elemental damage
						if (skill.elementalDamage) {
							let affinity = '';

							if (damage.elementalModifier > 1) {
								affinity = 'Strong elemental affinity';
							} else if (damage.elementalModifier < 1) {
								affinity = 'Weak elemental affinity';
							}

							if (affinity) {
								info.push({
									text: affinity,
									type: 'ACTION',
									position: targetPos
								});
							}
							info.push({
								text: formatNumber(damage.elemental),
								type: 'DAMAGE',
								element: skill.element,
								position: targetPos
							});
						}

						// apply skill damage / statuses to target
						target.applyDamage(damage.physical + damage.elemental, damageStatus);

						if (target.isDead()) {
							info.push({
								text: 'Dead',
								type: 'ACTION',
								position: targetPos
							});
							break;

						} else if (damage.status.length) {
							// add skill effects
							for (const status of damage.status) {
								info.push({
									text: status.title,
									type: 'DEBUFF',
									position: targetPos
								});
							}
						}
					}
				}

				if (info.length) {
					const infoTiming = info.map(_ => randomNumberBetween(250, 350));

					const infoAnim = new Animation(infoTiming, infoStep => {
						events.onBattleInfo(info[infoStep.number], targetPos);
					});

					infoAnim.start();
				}
			}

			events.onAnimation(this, step);

			if (step.isLast) {
				this.state = 'DONE';
				actor.skillReduceAP(action.cost);
				events.onEnd(this);
			}
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
				Logger.info(`ActAction onSelect: "${tgt ? `(${tgt.x}, ${tgt.y})` : '-'}"`);
				events.onSelect(action);
			},
			onConfirm: (action: ActAction) => {
				const actionItem = action.getAction();
				Logger.info(`ActAction onConfirm: "${actionItem ? actionItem.title : '-'}"`);
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
			onEnd: (action: ActAction) => {
				Logger.info('ActAction onEnd');
				events.onEnd(action);
			},
			onReactionStart: events.onReactionStart,
			onReactionSelected: events.onReactionSelected,
			onReactionBlock: events.onReactionBlock,
			onReactionEvasionStart: events.onReactionEvasionStart,
			onReactionEvasionEnd: events.onReactionEvasionEnd,
			onReactionPass: events.onReactionPass,
			onReactionReset: events.onReactionReset,
			onReactionEnd: events.onReactionEnd,
			onBattleInfo: (info: IBattleInfo, pos: Position) => {
				Logger.info(`ActAction onBattleInfo: "${info.text}" (${pos.x}, ${pos.y})`);
				events.onBattleInfo(info, pos);
			}
		};
	}
}

export default ActAction;
