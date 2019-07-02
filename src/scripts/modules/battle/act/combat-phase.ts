import Animation from 'core/animation';
import { getRandomItem } from 'core/array';
import { formatNumber, randomNumberBetween } from 'core/number';

import { affinityData } from 'data/damage';
import StatusEffects from 'data/status-effects';
import { skillAnimDuration } from 'data/game-config';

import { getDamage } from 'modules/battle/damage';

import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import ActPhase from 'modules/battle/act/phase';
import { IOnActPhaseEvent } from 'modules/battle/act';
import { IBattleInfo } from 'modules/battle/battle-info';
import CharacterAction from 'modules/battle/character-action';

export interface IActCombatRecord {
	readonly results: ICombatResult[];
}

export interface ICombatResult {
	readonly x?: any;
}

type Phase = 'SUSPENDED' | 'ANIMATION' | 'DONE';

export type CombatPhaseEvents =
	'COMBAT_SUSPENDED' |
	'COMBAT_ANIMATION' |
	'COMBAT_DONE';

class CombatPhase extends ActPhase<IActCombatRecord> {
	private readonly actor: Character;
	private readonly onEvent: IOnActPhaseEvent;
	private readonly combatResults: ICombatResult[] = [];

	private phase: Phase = 'SUSPENDED';

	constructor(actor: Character, characters: Character[], onEvent: IOnActPhaseEvent) {
		super();
		this.actor = actor;
		this.onEvent = onEvent;
	}

	public getActor(): Character {
		return this.actor;
	}

	public getPhase(): Phase {
		return this.phase;
	}

	public start(action: CharacterAction, effectArea: Tile[], targets: Character[]) {
		const { actor, phase } = this;

		if ('SUSPENDED' !== phase) {
			throw new Error('Could not start combat phase: invalid phase ' + phase);
		}
		this.phase = 'ANIMATION';

		const { skills } = action;
		const timing = Array(skills.length).fill(skillAnimDuration);

		const skillAnim = new Animation(timing, step => {
			const skill = skills[step.number];
			const info: IBattleInfo[] = [];

			for (const target of targets) {
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

								if (status) {
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

				if (damage.blocked) {
					// damage reduced by shield block
					target.status.remove('BLOCK_SMALL');
					target.status.remove('BLOCK_LARGE');

					info.push({
						text: 'Blocked',
						type: 'ACTION',
						position: targetPos
					});
				}

				if (damage.shielded) {
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

			this.onEvent('COMBAT_ANIMATION');

			if (step.isLast) {
				// finalize step
				actor.act(action);

				this.phase = 'DONE';
				this.onEvent('COMBAT_DONE');
				return;
			}
		});

		// start battle animation
		skillAnim.start();
	}

	public selectTile(tile: Tile | null) {
		// do nothing
	}

	public selectAction(action: CharacterAction) {
		// do nothing
	}

	public serialize(): IActCombatRecord {
		return {
			results: this.combatResults
		};
	}
}

export default CombatPhase;
