import Animation from 'core/animation';
import { getIntersection, getRandomItem } from 'core/array';
import { randomNumberBetween, formatNumber } from 'core/number';

import { affinityData } from 'data/damage';
import StatusEffects from 'data/status-effects';
import { skillAnimDuration } from 'data/game-config';

import { resolveDirection } from 'modules/geometry/direction';
import { getCombatInfo, getDamage, ICombatInfo } from 'modules/battle/damage';

import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import ActPhase from 'modules/battle/act/phase';
import { IOnActPhaseEvent } from 'modules/battle/act';
import { IBattleInfo } from 'modules/battle/battle-info';
import CharacterAction from 'modules/battle/character-action';
import ReactionPhase, { IActReactionRecord } from 'modules/battle/act/reaction-phase';

export interface IActActionRecord {
	readonly action: string | null;
	readonly target: string | null;
	readonly reactions: IActReactionRecord[];
}

interface IActionPhaseState {
	action?: {
		data: CharacterAction;
		area: Tile[];
		targetable: Tile[];
		target?: {
			tile: Tile;
			character: Character | null;
			combatInfo: ICombatInfo[];
			effectArea: Tile[];
			effectTargets: Character[];
			reactions?: {
				active: number;
				data: ReactionPhase[];
			}
		}
	};
}

type Phase = 'SUSPENDED' | 'IDLE' | 'TARGETING' | 'REACTING' | 'ANIMATION';

export type ActionPhaseEvents =
	'ACTION_SELECTED' |
	'ACTION_PASSED' |
	'ACTION_CANCELLED' |
	'ACTION_TARGETED' |
	'ACTION_ANIMATION' |
	'ACTION_DONE';

class ActionPhase extends ActPhase<IActActionRecord> {
	private readonly actor: Character;
	private readonly characters: Character[];
	private readonly onEvent: IOnActPhaseEvent;
	private state: IActionPhaseState = {};
	private phase: Phase = 'SUSPENDED';

	constructor(actor: Character, characters: Character[], onEvent: IOnActPhaseEvent) {
		super();

		this.actor = actor;
		this.characters = characters.filter(char => !char.isDead());
		this.onEvent = onEvent;
	}

	public getPhase(): Phase {
		return this.phase;
	}

	public getAction(): CharacterAction | null {
		const { action } = this.state;
		return action ? action.data : null;
	}

	public getArea(): Tile[] {
		const { action } = this.state;
		return action ? action.area : [];
	}

	public getTargetable(): Tile[] {
		const { action } = this.state;
		return action ? action.targetable : [];
	}

	public getTarget(): Tile | null {
		const { action } = this.state;
		const target = action ? action.target : null;
		return target ? target.tile : null;
	}

	public getEffectArea(): Tile[] {
		const { action } = this.state;
		const target = action ? action.target : null;
		return target ? target.effectArea : [];
	}

	public getEffectTarget(): Character | null {
		const { action } = this.state;
		const target = action ? action.target : null;
		return target ? target.character : null;
	}

	public getEffectTargets(): Character[] {
		const { action } = this.state;
		const target = action ? action.target : null;
		return target ? target.effectTargets : [];
	}

	public getReaction(): ReactionPhase | null {
		const { action } = this.state;
		const target = action ? action.target : null;
		const reactions = target ? target.reactions : null;
		return reactions ? reactions.data[reactions.active] || null : null;
	}

	public getReactions(): ReactionPhase[] {
		const { action } = this.state;
		const target = action ? action.target : null;
		const reactions = target ? target.reactions : null;
		return reactions ? reactions.data : [];
	}

	public start(action: CharacterAction) {
		const { phase } = this;

		if ('SUSPENDED' !== phase) {
			throw new Error('Could not start action phase: invalid phase ' + phase);
		}
		this.phase = 'IDLE';
		this.selectAction(action);
	}

	public selectTile(tile: Tile) {
		switch (this.phase) {
			case 'TARGETING':
				const target = this.getTarget();

				if (target === tile) {
					this.confirm();
				} else {
					this.setTarget(tile);
				}
				return;

			case 'REACTING':
				const reaction = this.getReaction();

				if (null === reaction) {
					throw new Error('Could not select tile: invalid reaction');
				}
				reaction.selectTile(tile);
				return;

			case 'IDLE':
			case 'SUSPENDED':
			case 'ANIMATION':
			default:
				return; // do nothing
		}
	}

	public selectAction(action: CharacterAction) {
		if (!action.active) {
			throw new Error('Could not select action: action no active');
		}
		switch (this.phase) {
			case 'IDLE':
				switch (action.type) {
					case 'ATTACK':
					case 'DOUBLE_ATTACK':
					case 'WEAPON':
					case 'MAGIC':
					case 'DYNAMIC': {
						// set new action phase
						if (!action.skills.length) {
							throw new Error('Could not select action: action has no skills');
						}
						this.set(action);
						return;
					}

					case 'PASS':
						// skip action phase
						this.pass(action);
						return;

					default:
						return; // do nothing
				}

			case 'TARGETING':
				switch (action.type) {
					case 'CONFIRM':
						// confirm selected action
						this.confirm();
						return;

					case 'BACK':
						// cancel selected action
						this.cancel();
						return;

					default:
						return; // do nothing
				}

			case 'REACTING':
				const reaction = this.getReaction();

				if (null === reaction) {
					throw new Error('Could not select action: invalid reaction');
				}
				reaction.selectAction(action);
				return;

			case 'SUSPENDED':
			case 'ANIMATION':
			default:
				return; // do nothing
		}
	}

	public serialize(): IActActionRecord {
		const action = this.getAction();
		const target = this.getEffectTarget();
		const reactions = this.getReactions();
		return {
			action: (action ? action.title : null),
			target: (target ? target.data.id : null),
			reactions: reactions.map(reaction => reaction.serialize())
		};
	}

	private setTarget(tile: Tile) {
		const { actor, phase, characters } = this;

		if ('TARGETING' !== phase) {
			throw new Error('Could not set action target: invalid phase ' + phase);
		}
		const action = this.state.action;

		if (!action || !action.data.active) {
			throw new Error('Could not select action target: invalid action');
		}
		const targets = this.getTargetable();

		if (!tile.isContained(targets)) {
			// tile not targetable
			return;
		}
		const { skills } = action.data;

		// get skill effect area
		const effectAreas = skills.map(s => s.getEffectArea(actor.position, tile));
		const effectArea = getIntersection(effectAreas);
		const effectTargets = skills[0].getTargets(actor, characters, effectArea);
		const effectTarget = characters.find(char => tile === char.position) || null;
		const combatInfo = effectTargets.map(reactor => getCombatInfo(actor, reactor, skills));

		action.target = {
			tile,
			combatInfo,
			effectArea,
			effectTargets,
			character: effectTarget
		};

		this.onEvent('ACTION_TARGETED', effectTarget);
	}

	private set(action: CharacterAction) {
		const { actor, characters, phase } = this;

		if ('IDLE' !== phase) {
			throw new Error('Could not set action: invalid phase ' + phase);
		}
		const allies = characters.filter(char => char.player === actor.player);
		const hitScanObstacles = allies.map(char => char.position);

		const skills = action.skills;
		const skillAreas = skills.map(skill => skill.getTargetable(actor.position, hitScanObstacles));
		const area = getIntersection(skillAreas);
		const targets = skills[0].getTargets(actor, characters, area);
		const targetable = targets.map(char => char.position);

		this.state.action = {
			data: action,
			area,
			targetable
		};
		this.phase = 'TARGETING';
		this.onEvent('ACTION_SELECTED', action);
	}

	private pass(action: CharacterAction) {
		const { phase } = this;

		if ('IDLE' !== phase) {
			throw new Error('Could not pass: invalid phase ' + phase);
		}
		this.state.action = {
			data: action,
			area: [],
			targetable: []
		};
		this.onEvent('ACTION_PASSED');
	}

	private cancel() {
		const { phase } = this;

		if ('TARGETING' !== phase) {
			throw new Error('Could not cancel action: invalid phase ' + phase);
		}
		delete this.state.action;

		this.phase = 'SUSPENDED';
		this.onEvent('ACTION_CANCELLED');
	}

	private confirm() {
		const { phase, state, characters } = this;

		if ('TARGETING' !== phase) {
			throw new Error('Could not confirm action: invalid phase ' + phase);
		}
		if (!state.action) {
			throw new Error('Could not confirm action: invalid action');
		}
		const { target } = state.action;

		if (!target) {
			throw new Error('Could not confirm action: invalid action target');
		}
		this.phase = 'REACTING';

		const onReactionEvent = this.onReactionEvent.bind(this);

		const reactions = target.effectTargets.map((reactor, r) => {
			const combatInfo = target.combatInfo[r];
			const backAttacked = combatInfo.attack.backAttack;
			return new ReactionPhase(reactor, characters, backAttacked, onReactionEvent);
		});

		target.reactions = {
			active: 0,
			data: reactions
		};

		this.startReact();
	}

	private startReact() {
		const { actor, phase } = this;

		if ('REACTING' !== phase) {
			throw new Error('Could not start reaction: invalid phase ' + phase);
		}
		const { action } = this.state;

		if (!action) {
			throw new Error('Could not start reaction: invalid action');
		}
		const reaction = this.getReaction();

		if (null === reaction) {
			// all targets have reacted
			this.animate();
			return;
		}
		// turn actor to face active reactor
		actor.direction = resolveDirection(actor.position, reaction.reactor.position);

		// start reaction
		reaction.start();
	}

	private onReactionEvent: IOnActPhaseEvent = (evt, data) => {
		const { phase } = this;

		if ('REACTING' !== phase) {
			throw new Error('Invalid action phase ' + phase);
		}
		switch (evt) {
			case 'REACTION_IDLE':
			case 'REACTION_EVADING':
				this.onEvent(evt, data);
				return;

			case 'REACTION_FINISHED':
				// update active reaction and start new
				const action = this.state.action;
				const target = action ? action.target : null;
				const reactions = target ? target.reactions : null;

				if (!reactions) {
					throw new Error('Could not finish reaction: invalid action data');
				}
				this.onEvent(evt, data);

				reactions.active++;
				this.startReact();
				return;

			default:
				return; // do nothing
		}
	}

	private animate() {
		const { actor, phase, state } = this;

		if ('REACTING' !== phase) {
			throw new Error('Could not start action animation: invalid phase ' + phase);
		}
		const action = this.getAction();

		if (!action || !action.active || !action.skills.length) {
			throw new Error('Could not start action animation: invalid action');
		}
		const data = state.action ? state.action.target : null;
		const reactions = data ? data.reactions : null;

		if (!data || !reactions) {
			throw new Error('Could not start action animation: invalid target data');
		}
		this.phase = 'ANIMATION';

		const { skills } = action;
		const { effectArea } = data;
		const timing = Array(skills.length).fill(skillAnimDuration);

		const skillAnim = new Animation(timing, step => {
			const skill = skills[step.number];
			const info: IBattleInfo[] = [];

			for (const reaction of reactions.data) {
				const target = reaction.reactor;
				const targetPos = target.position;
				const targetDead = target.isDead();
				const targetDying = target.status.has('DYING');

				if (!targetPos.isContained(effectArea)) {
					// target has been pushed / evaded from skill effect area
					info.push({
						text: 'Evaded',
						type: 'ACTION',
						position: targetPos
					});

					continue;
				}

				if ('SELF' === skill.target || 'ALLY' === skill.target) {
					// non-damaging skill used
					switch (skill.id) {
						case 'HOL_REMEDY':
							if (!targetDead && !targetDying) {
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
							}
							break;

						case 'HOL_REVIVE':
							if (targetDying) {
								// revive target
								target.revive(actor);

								info.push({
									text: 'Revived',
									type: 'BUFF',
									position: targetPos
								});
							}
							break;

						default:
							if (!targetDead && !targetDying) {
								// apply healing to target
								const magBonus = actor.mainHand.magical + actor.offHand.magical;
								let healing = (actor.attributes.MAG + magBonus) * skill.magical;

								healing = healing > 0 ? Math.round(healing) : 0;
								target.applyHealing(actor, healing, skill.status);

								info.push({
									text: formatNumber(healing),
									type: 'HEALING',
									position: targetPos
								});

								for (const id of skill.status) {
									info.push({
										text: StatusEffects.get(id)(actor, 0, 0).effect,
										type: 'BUFF',
										position: targetPos
									});
								}
							}
					}
					continue;
				}

				// get battle info
				const damage = getDamage(actor, target, skill);
				const damageStatus = damage.status.map(status => status.id);

				if (null !== damage.blocked) {
					// damage reduced by shield block
					target.status.remove('BLOCK_SMALL');
					target.status.remove('BLOCK_LARGE');

					info.push({
						text: 'Blocked',
						type: 'ACTION',
						position: targetPos
					});
				}

				if (null !== damage.shielded) {
					// damage reduced by energy shield
					target.status.remove('ENERGY_SHIELD');

					info.push({
						text: `Shielded (${damage.shielded.cost} MP)`,
						type: 'ACTION',
						position: targetPos
					});
				}

				if (damage.backAttack) {
					// back attacked
					info.push({
						text: 'Back attack',
						type: 'ACTION',
						position: targetPos
					});
				}

				if (skill.physical) {
					// physical damage done
					info.push({
						text: formatNumber(damage.physical),
						type: 'DAMAGE',
						position: targetPos
					});
				}

				if (skill.magical) {
					// magical damage done
					if (damage.affinity !== 'ELEMENTAL_NEUTRAL') {
						const affinity = affinityData[damage.affinity];

						info.push({
							text: affinity.title,
							type: 'ACTION',
							position: targetPos
						});
					}
					info.push({
						text: formatNumber(damage.magical),
						type: 'DAMAGE',
						element: skill.element,
						position: targetPos
					});
				}

				// apply skill damage / statuses to target
				const mpDamage = (damage.shielded ? damage.shielded.cost : 0);
				target.applyDamage(actor, damage.physical, damage.magical, mpDamage, damageStatus);

				if (targetDying) {
					info.push({
						text: 'Dying',
						type: 'ACTION',
						position: targetPos
					});
					continue;
				}

				if (damage.status.length) {
					// add skill effects
					for (const status of damage.status) {
						info.push({
							text: status.effect,
							type: 'DEBUFF',
							position: targetPos
						});
					}
				}
			}

			if (info.length) {
				const infoTiming = info.map(_ => randomNumberBetween(250, 350));

				const infoAnim = new Animation(infoTiming, infoStep => {
					const i = info[infoStep.number];
					this.onEvent('BATTLE_INFO', i);

					const elm = (i.element ? `(${i.element})` : '');
					Logger.info(`ActAction battle: ${i.type} ${i.text} ${elm}`);
				});

				// start battle info animation
				infoAnim.start();
			}

			this.onEvent('ACTION_ANIMATION');

			if (step.isLast) {
				// finalize step
				actor.act(action);
				this.onEvent('ACTION_DONE');
				return;
			}
		});

		// start battle animation
		skillAnim.start();
	}
}

export default ActionPhase;
