import Animation from 'core/animation';
import { getRandomItem } from 'core/array';
import { formatNumber, randomNumberBetween } from 'core/number';

import { affinityData } from 'data/combat';
import { skillAnimDuration } from 'data/game-config';

import { getCombatInfo, ICombatInfo } from 'modules/battle/combat';

import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import Command from 'modules/battle/command';
import ActPhase from 'modules/battle/act/phase';
import { IOnActPhaseEvent } from 'modules/battle/act';
import { IBattleInfo } from 'modules/battle/battle-info';

export interface IActCombatRecord {
	readonly results: ICombatResult[];
}

export interface ICombatResult {
	readonly character: string;
	damaged: number;
	healed: number;
	killed: boolean;
	revived: boolean;
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

	public start(command: Command, effectArea: Tile[], targets: Character[]) {
		const { actor, phase } = this;

		if ('SUSPENDED' !== phase) {
			throw new Error('Could not start combat phase: invalid phase ' + phase);
		}
		this.phase = 'ANIMATION';

		const { skills } = command;
		const timing = Array(skills.length).fill(skillAnimDuration);

		// prepare results object
		for (const tgt of targets) {
			this.combatResults.push({
				character: tgt.data.id,
				damaged: 0,
				healed: 0,
				killed: false,
				revived: false
			});
		}

		const skillAnim = new Animation(timing, step => {
			const info: IBattleInfo[] = [];

			for (const target of targets) {
				const combat = getCombatInfo(actor, target, skills[step.number]);
				const result = this.combatResults[step.number];
				const { position } = combat.target;

				if (!position.isContained(effectArea)) {
					// target has been pushed / evaded from skill effect area
					info.push({
						text: 'Evaded',
						type: 'ACTION',
						position
					});
					continue;
				}
				switch (combat.type) {
					case 'SUPPORT':
						this.handleSupport(combat, result, info);
						break;

					case 'DAMAGE':
						this.handleDamage(combat, result, info);
						break;

					default:
						throw new Error('Invalid combat info type: ' + combat.type);
				}
			}

			if (info.length) {
				const infoTiming = info.map(_ => randomNumberBetween(250, 350));

				const infoAnim = new Animation(infoTiming, infoStep => {
					const i = info[infoStep.number];
					this.onEvent('BATTLE_INFO', i);
				});

				// start battle info animation
				infoAnim.start();

				// log info to console
				for (const i of info) {
					const elm = (i.element ? `(${i.element})` : '');
					Logger.info(`ActCombat: ${i.type} ${i.text} ${elm}`);
				}
			}

			this.onEvent('COMBAT_ANIMATION');

			if (step.isLast) {
				// finalize step
				actor.act(command);

				for (const target of targets) {
					// remove reactive statuses
					target.status.removeByID('BLOCK_SMALL');
					target.status.removeByID('BLOCK_LARGE');
					target.status.removeByID('ENERGY_SHIELD');
				}
				this.phase = 'DONE';
				this.onEvent('COMBAT_DONE');
			}
		});

		// start battle animation
		skillAnim.start();
	}

	public selectTile(tile: Tile | null) {
		// do nothing
	}

	public selectCommand(command: Command) {
		// do nothing
	}

	public serialize(): IActCombatRecord {
		return {
			results: this.combatResults
		};
	}

	private handleSupport(combat: ICombatInfo, result: ICombatResult, info: IBattleInfo[]) {
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
					});

					info.push({
						text: formatNumber(healing),
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
				}
				return;
		}
	}

	private handleDamage(combat: ICombatInfo, result: ICombatResult, info: IBattleInfo[]) {
		const { target, skill, blocked, shielded, affinity, status } = combat;
		const { position } = target;

		// damage reduced by shield block
		if (blocked) {
			info.push({
				text: 'Blocked',
				type: 'ACTION',
				position
			});
		}

		// damage reduced by energy shield
		if (shielded) {
			info.push({
				text: `Shielded (${shielded.cost} MP)`,
				type: 'ACTION',
				position
			});
		}

		// back attacked
		if (combat.backAttack) {
			info.push({
				text: 'Back attack',
				type: 'ACTION',
				position
			});
		}

		// physical damage done
		if (skill.physical) {
			info.push({
				text: formatNumber(combat.physical),
				type: 'DAMAGE',
				position
			});
		}

		// magical damage done
		if (skill.magical) {
			if (affinity !== 'ELEMENTAL_NEUTRAL') {
				info.push({
					text: affinityData[affinity].title,
					type: 'ACTION',
					position
				});
			}
			info.push({
				text: formatNumber(combat.magical),
				type: 'DAMAGE',
				element: skill.element,
				position
			});
		}

		// apply skill damage / statuses to target
		const statuses = status.map(item => item.id);
		const mpDamage = (shielded ? shielded.cost : 0);

		target.onDamage(combat.physical, combat.magical, mpDamage, statuses, (dmg, killed) => {
			result.damaged += dmg;
			result.killed = result.killed || !!killed;
		});

		if (target.status.has('DYING')) {
			info.push({
				text: 'Dying',
				type: 'ACTION',
				position
			});
			return;
		}

		// add skill effects
		for (const item of status) {
			info.push({
				text: item.effect,
				type: 'DEBUFF',
				position
			});
		}
	}
}

export default CombatPhase;
