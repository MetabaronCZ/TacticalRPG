import Animation from 'core/animation';
import { getRandomItem } from 'core/array';
import { formatNumber, randomNumberBetween } from 'core/number';

import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import Command from 'modules/battle/command';
import ActPhase from 'modules/battle/act/phase';
import { IOnActPhaseEvent } from 'modules/battle/act';
import { IBattleInfo } from 'modules/battle/battle-info';
import { getCombatInfo, ICombatInfo } from 'modules/battle/combat';
import SkillAnimation from 'modules/battle/act/skill-animation';

const txtCombat = 'Combat in progress...';

export interface ICombatPhaseSnapshot {
	readonly phase: Phase;
	readonly results: ICombatResult[];
}

export interface ICombatPhaseRecord {
	readonly results: ICombatResult[];
}

export interface ICombatResult {
	readonly isSupport: boolean;
	readonly character: string;
	damaged: number;
	healed: number;
	killed: boolean;
	revived: boolean;
	evaded: boolean;
}

type Phase = 'SUSPENDED' | 'ANIMATION' | 'DONE';

export type CombatPhaseEvents =
	'COMBAT_SUSPENDED' |
	'COMBAT_ANIMATION' |
	'COMBAT_DONE';

class CombatPhase extends ActPhase<ICombatPhaseSnapshot, ICombatPhaseRecord> {
	public readonly actor: Character;

	private readonly onEvent: IOnActPhaseEvent;
	private readonly combatResults: ICombatResult[] = [];

	private phase: Phase = 'SUSPENDED';

	constructor(actor: Character, characters: Character[], onEvent: IOnActPhaseEvent) {
		super();
		this.actor = actor;
		this.onEvent = onEvent;
	}

	public start(command: Command, effectArea: Tile[], targets: Character[]): void {
		const { actor, phase } = this;

		if ('SUSPENDED' !== phase) {
			throw new Error('Could not start combat phase: invalid phase ' + phase);
		}
		this.phase = 'ANIMATION';
		this.info = txtCombat;

		// prepare results object
		for (const tgt of targets) {
			this.combatResults.push({
				isSupport: command.isSupport,
				character: tgt.id,
				damaged: 0,
				healed: 0,
				killed: false,
				revived: false,
				evaded: false
			});
		}

		const skills = [...command.skills];

		const run = (): void => {
			const skill = skills.shift();

			if (!skill) {
				// finalize combat animation
				this.phase = 'DONE';
				this.info = '';

				actor.act(command);

				this.onEvent('COMBAT_DONE');
				return;
			}

			// animate skill
			const anim = new SkillAnimation(
				actor,
				skill,
				() => {
					// on skill action phase
					const info: IBattleInfo[] = [];
	
					targets.forEach((target, t) => {
						const combat = getCombatInfo(actor, target, skill);
						const result = this.combatResults[t];
						const { position } = combat.target;
		
						if (!position.isContained(effectArea)) {
							// target has been pushed / evaded from skill effect area
							result.evaded = true;
		
							info.push({
								text: 'Evaded',
								type: 'ACTION',
								position
							});
							return;
						}
						if (skill.isSupport) {
							this.handleSupport(combat, result, info);
						} else {
							this.handleDamage(combat, result, info);
						}
					});
		
					if (info.length) {
						const infoTiming = info.map(() => randomNumberBetween(250, 350));
		
						const infoAnim = new Animation(infoTiming, false, infoStep => {
							const i = info[infoStep.number];
							this.onEvent('BATTLE_INFO', i);
						});
		
						// start battle info animation
						infoAnim.start();
		
						// log info to console
						for (const i of info) {
							const elm = ((i.element && 'NONE' !== i.element) ? `(${i.element})` : '');
							Logger.info(`ActCombat: ${i.type} ${i.text} ${elm}`);
						}
					}
		
					this.onEvent('COMBAT_ANIMATION');
				},
				() => {
					// on skill end / run next skill animation
					run();
				}
			);

			anim.start();
		};

		// start battle animation
		run();
	}

	public selectTile(): void {
		// do nothing
	}

	public selectCommand(): void {
		// do nothing
	}

	public serialize(): ICombatPhaseSnapshot {
		return {
			phase: this.phase,
			results: [...this.combatResults]
		};
	}

	public getRecord(): ICombatPhaseRecord {
		return {
			results: [...this.combatResults]
		};
	}

	private handleSupport(combat: ICombatInfo, result: ICombatResult, info: IBattleInfo[]): void {
		const { target, skill, healing, status } = combat;
		const isDying = target.status.has('DYING');
		const isDead = target.isDead();
		const { position } = target;

		switch (skill.id) {
			case 'HOL_REMEDY':
				if (!isDead && !isDying) {
					// remove one bad status
					const harmfulStatuses = target.status.get().filter(s => 'SUPPORT' !== s.type);
					const effect = getRandomItem(harmfulStatuses);

					if (effect) {
						target.status.remove(effect);
					}
					info.push({
						text: `${effect ? effect.title : 'No'} status healed`,
						type: 'HEALING',
						position
					});
				}
				return;

			case 'HOL_REVIVE':
				if (isDying) {
					// revive target
					target.onRevive((amount, revived) => {
						result.healed += amount;
						result.revived = result.revived || !revived;
					});

					info.push({
						text: 'Revived',
						type: 'BUFF',
						position
					});
				}
				return;

			default:
				if (!isDead && !isDying) {
					// apply healing to target
					const statuses = status.map(item => item.id);

					target.onHealing(healing, statuses, healed => {
						result.healed += healed;

						info.push({
							text: formatNumber(healed),
							type: 'HEALING',
							position
						});

						for (const item of status) {
							info.push({
								text: item.effect,
								type: 'BUFF',
								position
							});
						}
					});
				}
				return;
		}
	}

	private handleDamage(combat: ICombatInfo, result: ICombatResult, info: IBattleInfo[]): void {
		const { target, skill, blocked, shielded, status } = combat;
		const { position } = target;

		if (target.isDead() || target.status.has('DYING')) {
			return;
		}

		// damage reduced by shield block
		if (blocked) {
			info.push({
				text: 'Blocked',
				type: 'REACTION',
				weapon: (skill.block ? skill.block.weapon : 'NONE'),
				position
			});
		}

		// damage reduced by energy shield
		if (shielded) {
			info.push({
				text: `Shielded (${shielded.cost} MP)`,
				type: 'REACTION',
				position
			});
		}

		// physical damage done
		if (skill.physical) {
			info.push({
				text: formatNumber(combat.physical),
				type: 'DAMAGE',
				weapon: skill.physical.weapon,
				position
			});
		}

		// magical damage done
		if (skill.magical) {
			info.push({
				text: formatNumber(combat.magical),
				type: 'DAMAGE',
				element: skill.magical.element,
				position
			});
		}

		// apply skill damage / statuses to target
		const statuses = status.map(item => item.id);
		const mpDamage = (shielded ? shielded.cost : 0);

		target.onDamage(combat.damage, mpDamage, statuses, (dmg, killed) => {
			result.damaged += dmg;
			result.killed = result.killed || !!killed;
		});

		// add skill effects
		for (const item of status) {
			info.push({
				text: item.effect,
				type: 'DEBUFF',
				weapon: (skill.physical ? skill.physical.weapon : 'NONE'),
				element: (skill.magical ? skill.magical.element : 'NONE'),
				status: item.id,
				position
			});
		}
	}
}

export default CombatPhase;
