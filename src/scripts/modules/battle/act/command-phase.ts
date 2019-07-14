import { getIntersection } from 'core/array';

import Tile from 'modules/geometry/tile';
import Character from 'modules/character';
import Command from 'modules/battle/command';
import ActPhase from 'modules/battle/act/phase';
import { IOnActPhaseEvent } from 'modules/battle/act';
import { getCombatInfo, ICombatInfo } from 'modules/battle/combat';

export interface IActCommandRecord {
	readonly command: string | null;
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
		}
	};
}

type Phase = 'SUSPENDED' | 'IDLE' | 'TARGETING' | 'DONE';

export type CommandPhaseEvents =
	'COMMAND_SELECTED' |
	'COMMAND_PASSED' |
	'COMMAND_CANCELLED' |
	'COMMAND_TARGETED' |
	'COMMAND_DONE';

class CommandPhase extends ActPhase<IActCommandRecord> {
	private readonly actor: Character;
	private readonly characters: Character[];
	private readonly onEvent: IOnActPhaseEvent;
	private state: IState = {};
	private phase: Phase = 'SUSPENDED';

	constructor(actor: Character, characters: Character[], onEvent: IOnActPhaseEvent) {
		super();

		this.actor = actor;
		this.characters = characters.filter(char => !char.isDead());
		this.onEvent = onEvent;
	}

	public getActor(): Character {
		return this.actor;
	}

	public getPhase(): Phase {
		return this.phase;
	}

	public getCommand(): Command | null {
		const { command } = this.state;
		return command ? command.data : null;
	}

	public getArea(): Tile[] {
		const { command } = this.state;
		return command ? [...command.area] : [];
	}

	public getTargetable(): Tile[] {
		const { command } = this.state;
		return command ? [...command.targetable] : [];
	}

	public getTarget(): Tile | null {
		const { command } = this.state;
		const target = command ? command.target : null;
		return target ? target.tile : null;
	}

	public getEffectArea(): Tile[] {
		const { command } = this.state;
		const target = command ? command.target : null;
		return target ? [...target.effectArea] : [];
	}

	public getEffectTarget(): Character | null {
		const { command } = this.state;
		const target = command ? command.target : null;
		return target ? target.character : null;
	}

	public getEffectTargets(): Character[] {
		const { command } = this.state;
		const target = command ? command.target : null;
		return target ? target.effectTargets.map(eff => eff.character) : [];
	}

	public getCombatInfo(): IEffectTargetData[] {
		const { command } = this.state;
		const target = command ? command.target : null;
		return target ? [...target.effectTargets] : [];
	}

	public start(command: Command) {
		const { phase } = this;

		if ('SUSPENDED' !== phase) {
			throw new Error('Could not start command phase: invalid phase ' + phase);
		}
		this.phase = 'IDLE';
		this.selectCommand(command);
	}

	public selectTile(tile: Tile) {
		if ('TARGETING' === this.phase) {
			const target = this.getTarget();

			if (target === tile) {
				this.confirm();
			} else {
				this.setTarget(tile);
			}
		}
	}

	public selectCommand(command: Command) {
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

	public serialize(): IActCommandRecord {
		const command = this.getCommand();
		const target = this.getEffectTarget();
		return {
			command: (command ? command.title : null),
			target: (target ? target.data.id : null)
		};
	}

	private setTarget(tile: Tile) {
		const { actor, phase, characters } = this;

		if ('TARGETING' !== phase) {
			throw new Error('Could not set command target: invalid phase ' + phase);
		}
		const { command } = this.state;

		if (!command || !command.data.isActive()) {
			throw new Error('Could not select command target: invalid command');
		}
		const targets = this.getTargetable();

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

		this.onEvent('COMMAND_TARGETED', effectTarget);
	}

	private set(command: Command) {
		const { actor, characters, phase } = this;

		if ('IDLE' !== phase) {
			throw new Error('Could not set command: invalid phase ' + phase);
		}
		const allies = characters.filter(char => char.player === actor.player);
		const hitScanObstacles = allies.map(char => char.position);

		const { skills } = command;
		const skillAreas = skills.map(skill => skill.getTargetable(actor.position, hitScanObstacles));
		const area = getIntersection(skillAreas);
		const targets = skills[0].getTargets(actor, characters, area);
		const targetable = targets.map(char => char.position);

		this.state.command = {
			data: command,
			area,
			targetable
		};
		this.phase = 'TARGETING';
		this.onEvent('COMMAND_SELECTED', command);
	}

	private pass(command: Command) {
		const { phase } = this;

		if ('IDLE' !== phase) {
			throw new Error('Could not pass command: invalid phase ' + phase);
		}
		this.state.command = {
			data: command,
			area: [],
			targetable: []
		};
		this.onEvent('COMMAND_PASSED');
	}

	private cancel() {
		const { phase } = this;

		if ('TARGETING' !== phase) {
			throw new Error('Could not cancel command: invalid phase ' + phase);
		}
		delete this.state.command;

		this.phase = 'SUSPENDED';
		this.onEvent('COMMAND_CANCELLED');
	}

	private confirm() {
		const { phase } = this;

		if ('TARGETING' !== phase) {
			throw new Error('Could not confirm command: invalid phase ' + phase);
		}
		this.phase = 'DONE';
		this.onEvent('COMMAND_DONE');
	}
}

export default CommandPhase;
