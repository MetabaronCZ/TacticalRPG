import Tile from 'modules/geometry/tile';
import ActPhase from 'modules/battle/act/phase';
import { IOnActPhaseEvent } from 'modules/battle/act';
import Character, { ICharacterSnapshot } from 'modules/character';
import { ICombatPreview, getCombatPreview } from 'modules/battle/combat';
import Command, { ICommandRecord, ICommandSnapshot } from 'modules/battle/command';

const txtIdle = 'Select command target on grid.';

export interface ICommandPhaseSnapshot {
	readonly phase: CommandPhaseID;
	readonly command: ICommandSnapshot | null;
	readonly area: Tile[];
	readonly targetable: Tile[];
	readonly target: Tile | null;
	readonly effectArea: Tile[];
	readonly effectTarget: ICharacterSnapshot | null;
	readonly effectTargets: ICharacterSnapshot[];
	readonly combatPreview: ICombatPreview | null;
}

export interface ICommandPhaseRecord {
	readonly command: ICommandRecord | null;
	readonly target: {
		readonly id: string;
		readonly player: number;
	} | null;
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
			readonly effectTargets: Character[];
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

class CommandPhase extends ActPhase<ICommandPhaseSnapshot, ICommandPhaseRecord> {
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
			const { target } = this.serialize();

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
							throw new Error('Could not select command without skills: ' + command.id);
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

	public getCommand(): Command | null {
		const { command } = this.state;
		return command ? command.data : null;
	}

	public getEffectArea(): Tile[] {
		const { command } = this.state;
		const target = command ? command.target : null;
		return target ? target.effectArea : [];
	}

	public getEffectTargets(): Character[] {
		const { command } = this.state;
		const target = command ? command.target : null;
		return target ? target.effectTargets : [];
	}

	public serialize(): ICommandPhaseSnapshot {
		const { command } = this.state;
		const cmd = (command ? command.data : null);
		const target = command ? command.target : null;

		const effectTarget = (target && target.character)
			? target.character
			: null;

		const preview = cmd
			? getCombatPreview(cmd, this.actor, effectTarget)
			: null;

		return {
			phase: this.phase,
			command: (cmd ? cmd.serialize() : null),
			area: (command ? [...command.area] : []),
			targetable: (command ? [...command.targetable] : []),
			target: (target ? target.tile : null),
			effectArea: (target ? [...target.effectArea] : []),
			effectTarget: (effectTarget ? effectTarget.serialize() : null),
			effectTargets: this.getEffectTargets().map(char => char.serialize()),
			combatPreview: preview
		};
	}

	public getRecord(): ICommandPhaseRecord {
		const { command, effectTarget } = this.serialize();
		return {
			command: command
				? {
					title: command.title,
					skills: command.skills.map(skill => skill.id)
				}
				: null
			,
			target: (effectTarget ?
				{
					id: effectTarget.data.id,
					player: effectTarget.player.id
				}
				: null
			)
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
		const targets = this.serialize().targetable;

		if (!tile.isContained(targets)) {
			// tile not targetable
			return;
		}
		const cmd = command.data;

		// get skill effect area
		const effectArea = cmd.getSkillEfectArea(actor, tile);
		const effectTarget = characters.find(char => tile === char.position) || null;
		const effectTargets = cmd.getSkillEfectTargets(actor, characters, effectArea);

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
		const area = command.getSkillArea(actor, characters);
		const targetable = command.getSkillTargetable(actor, characters, area);

		this.state.command = {
			data: command,
			area,
			targetable: targetable.map(char => char.position)
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
