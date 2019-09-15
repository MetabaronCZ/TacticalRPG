import { getIntersection } from 'core/array';

import Tile from 'modules/geometry/tile';
import ActPhase from 'modules/battle/act/phase';
import { IOnActPhaseEvent } from 'modules/battle/act';
import Character, { ICharacter } from 'modules/character';
import Command, { ICommandRecord } from 'modules/battle/command';
import { getCombatInfo, ICombatInfo } from 'modules/battle/combat';

const txtIdle = 'Select command target on grid.';

interface IEffectTarget {
	readonly character: ICharacter;
	readonly combat: ICombatInfo[];
}

export interface ICommandPhaseState {
	readonly phase: CommandPhaseID;
	readonly command: Command | null;
	readonly area: Tile[];
	readonly targetable: Tile[];
	readonly target: Tile | null;
	readonly effectArea: Tile[];
	readonly effectTarget: ICharacter | null;
	readonly effectTargets: ICharacter[];
	readonly combatInfo: IEffectTarget[];
}

export interface ICommandPhaseRecord {
	readonly command: ICommandRecord | null;
	readonly target: string | null;
}

export interface IEffectTargetData {
	readonly character: Character;
	readonly combat: ICombatInfo[];
}

interface IState {
	command?: {
		readonly data: Command;
		readonly area: Tile[];
		readonly targetable: Tile[];
		target?: {
			readonly tile: Tile;
			readonly character: Character | null;
			readonly effectArea: Tile[];
			readonly effectTargets: IEffectTargetData[];
		};
	};
}

export type CommandPhaseID = 'SUSPENDED' | 'IDLE' | 'TARGETING' | 'DONE';

export type CommandPhaseEvents =
	'COMMAND_SELECTED' |
	'COMMAND_PASSED' |
	'COMMAND_CANCELLED' |
	'COMMAND_TARGETED' |
	'COMMAND_DONE';

class CommandPhase extends ActPhase<ICommandPhaseState, ICommandPhaseRecord> {
	public readonly actor: Character;
	private readonly characters: Character[];
	private readonly onEvent: IOnActPhaseEvent;
	private state: IState = {};
	private phase: CommandPhaseID = 'SUSPENDED';

	constructor(actor: Character, characters: Character[], onEvent: IOnActPhaseEvent) {
		super();

		this.actor = actor;
		this.characters = characters.filter(char => !char.isDead());
		this.onEvent = onEvent;
	}

	public start(command: Command): void {
		const { phase } = this;

		if ('SUSPENDED' !== phase) {
			throw new Error('Could not start command phase: invalid phase ' + phase);
		}
		this.phase = 'IDLE';
		this.selectCommand(command);
	}

	public selectTile(tile: Tile): void {
		if ('TARGETING' === this.phase) {
			const { target } = this.getState();

			if (target === tile) {
				this.confirm();
			} else {
				this.setTarget(tile);
			}
		}
	}

	public selectCommand(command: Command): void {
		if (!command.isActive()) {
			throw new Error('Could not select command: command not active');
		}
		switch (this.phase) {
			case 'IDLE':
				switch (command.type) {
					case 'ATTACK':
					case 'DOUBLE_ATTACK':
					case 'WEAPON':
					case 'MAGIC':
					case 'DYNAMIC': {
						// set new command phase
						if (!command.skills.length) {
							throw new Error('Could not select command: no skills');
						}
						this.set(command);
						return;
					}

					case 'PASS':
						// skip command phase
						this.pass(command);
						return;

					default:
						return; // do nothing
				}

			case 'TARGETING':
				switch (command.type) {
					case 'CONFIRM':
						// confirm selected command
						this.confirm();
						return;

					case 'BACK':
						// cancel selected command
						this.cancel();
						return;

					default:
						return; // do nothing
				}

			case 'SUSPENDED':
			default:
				return; // do nothing
		}
	}

	public getCombatInfo(): IEffectTargetData[] {
		const { command } = this.state;
		const target = command ? command.target : null;
		return target ? [...target.effectTargets] : [];
	}

	public getEffectTargets(): Character[] {
		const { command } = this.state;
		const target = command ? command.target : null;
		return target ? target.effectTargets.map(eff => eff.character) : [];
	}

	public getState(): ICommandPhaseState {
		const { command } = this.state;
		const target = command ? command.target : null;
		return {
			phase: this.phase,
			command: (command ? command.data : null),
			area: (command ? [...command.area] : []),
			targetable: (command ? [...command.targetable] : []),
			target: (target ? target.tile : null),
			effectArea: (target ? [...target.effectArea] : []),
			effectTarget: (target && target.character ? target.character.serialize() : null),
			effectTargets: this.getEffectTargets().map(char => char.serialize()),
			combatInfo: this.getCombatInfo().map(combat => ({
				...combat,
				character: combat.character.serialize()
			}))
		};
	}

	public getRecord(): ICommandPhaseRecord {
		const { command, effectTarget } = this.getState();
		return {
			command: command
				? {
					title: command.title,
					skills: command.skills.map(skill => skill.id)
				}
				: null
			,
			target: (effectTarget ? effectTarget.id : null)
		};
	}

	private setTarget(tile: Tile): void {
		const { actor, phase, characters } = this;

		if ('TARGETING' !== phase) {
			throw new Error('Could not set command target: invalid phase ' + phase);
		}
		const { command } = this.state;

		if (!command || !command.data.isActive()) {
			throw new Error('Could not select command target: invalid command');
		}
		const targets = this.getState().targetable;

		if (!tile.isContained(targets)) {
			// tile not targetable
			return;
		}
		const { skills } = command.data;

		// get skill effect area
		const effectAreas = skills.map(s => s.getEffectArea(actor.position, tile));
		const effectArea = getIntersection(effectAreas);
		const effectTarget = characters.find(char => tile === char.position) || null;

		const effectTargets = skills[0]
			.getTargets(actor, characters, effectArea)
			.map(tgt => ({
				character: tgt,
				combat: skills.map(skill => getCombatInfo(actor, tgt, skill))
			}));

		command.target = {
			tile,
			effectArea,
			effectTargets,
			character: effectTarget
		};
		this.info = '';

		this.onEvent('COMMAND_TARGETED', effectTarget);
	}

	private set(command: Command): void {
		const { actor, characters, phase } = this;

		if ('IDLE' !== phase) {
			throw new Error('Could not set command: invalid phase ' + phase);
		}
		const { skills } = command;
		const hitScanObstacles = characters.map(char => char.position);

		const allyTiles = characters
			.filter(char => char.player === actor.player)
			.map(char => char.position);

		const skillAreas = skills.map(skill => {
			const tiles = skill.getTargetable(actor.position, hitScanObstacles);

			if ('ENEMY' === skill.target) {
				// exclude ally character positions
				return tiles.filter(tile => -1 === allyTiles.indexOf(tile));
			}
			return tiles;
		});

		const area = getIntersection(skillAreas);
		const targets = skills[0].getTargets(actor, characters, area);
		const targetable = targets.map(char => char.position);

		this.state.command = {
			data: command,
			area,
			targetable
		};
		this.phase = 'TARGETING';
		this.info = txtIdle;

		this.onEvent('COMMAND_SELECTED', command);
	}

	private pass(command: Command): void {
		const { phase } = this;

		if ('IDLE' !== phase) {
			throw new Error('Could not pass command: invalid phase ' + phase);
		}
		this.state.command = {
			data: command,
			area: [],
			targetable: []
		};
		this.info = '';

		this.onEvent('COMMAND_PASSED');
	}

	private cancel(): void {
		const { phase } = this;

		if ('TARGETING' !== phase) {
			throw new Error('Could not cancel command: invalid phase ' + phase);
		}
		delete this.state.command;

		this.phase = 'SUSPENDED';
		this.info = '';

		this.onEvent('COMMAND_CANCELLED');
	}

	private confirm(): void {
		const { phase } = this;

		if ('TARGETING' !== phase) {
			throw new Error('Could not confirm command: invalid phase ' + phase);
		}
		this.phase = 'DONE';
		this.info = '';

		this.onEvent('COMMAND_DONE');
	}
}

export default CommandPhase;
