import {
	getIdleCommands, getSkillConfirmCommands, getReactiveCommands, getEvasiveCommands
} from 'modules/battle/commands';

import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import AIPlayer from 'modules/ai/player';
import { IBattleInfo } from 'modules/battle/battle-info';
import { reactiveEffects } from 'modules/battle/status-effect';
import Character, { ICharacterSnapshot } from 'modules/character';
import Command, { ICommandSnapshot } from 'modules/battle/command';

import MovePhase, { MovePhaseEvents, IMovePhaseRecord, IMovePhaseSnapshot } from 'modules/battle/act/move-phase';
import CombatPhase, { CombatPhaseEvents, ICombatPhaseRecord, ICombatPhaseSnapshot } from 'modules/battle/act/combat-phase';
import DirectPhase, { DirectPhaseEvents, IDirectPhaseRecord, IDirectPhaseSnapshot } from 'modules/battle/act/direct-phase';
import CommandPhase, { CommandPhaseEvents, ICommandPhaseRecord, ICommandPhaseSnapshot } from 'modules/battle/act/command-phase';
import ReactionPhase, { ReactionPhaseEvents, IReactionPhaseRecord, IReactionPhaseSnapshot } from 'modules/battle/act/reaction-phase';

export type ActPhaseID = 'MOVEMENT' | 'COMMAND' | 'REACTION' | 'COMBAT' | 'DIRECTION';

interface IPhases {
	readonly MOVEMENT: MovePhase;
	readonly COMMAND: CommandPhase;
	readonly REACTION: ReactionPhase;
	readonly DIRECTION: DirectPhase;
	readonly COMBAT: CombatPhase;
}

export type ActPhaseEvent = 'BATTLE_INFO' | MovePhaseEvents | CommandPhaseEvents | ReactionPhaseEvents | CombatPhaseEvents | DirectPhaseEvents;
export type IOnActPhaseEvent = (event: ActPhaseEvent, data?: Character | Command | Tile | IBattleInfo | null) => void;

export interface IActEvents {
	readonly onUpdate: () => void;
	readonly onBattleInfo: (info: IBattleInfo) => void;
	readonly onEnd: (act: Act) => void;
}

export interface IActSnapshot {
	readonly actor: ICharacterSnapshot;
	readonly phase: ActPhaseID | null;
	readonly commands: ICommandSnapshot[];
	readonly actingCharacter: ICharacterSnapshot | null;
	readonly info: string;
	readonly phases: {
		readonly MOVEMENT: IMovePhaseSnapshot;
		readonly COMMAND: ICommandPhaseSnapshot;
		readonly REACTION: IReactionPhaseSnapshot;
		readonly DIRECTION: IDirectPhaseSnapshot;
		readonly COMBAT: ICombatPhaseSnapshot;
	};
}
export interface IActRecord {
	readonly id: number;
	readonly actor: string;
	readonly player: number;
	readonly skipped: boolean;
	readonly movementPhase: IMovePhaseRecord;
	readonly commandPhase: ICommandPhaseRecord;
	readonly reactionPhase: IReactionPhaseRecord;
	readonly combatPhase: ICombatPhaseRecord;
	readonly directionPhase: IDirectPhaseRecord;
}

class Act {
	public readonly id: number;
	public readonly actor: Character;
	private readonly phases: IPhases;
	private readonly events: IActEvents;
	private readonly characters: Character[];

	private phase: ActPhaseID | null = null;
	private commands: Command[] = [];
	private skipped = false;
	private info = '';

	constructor(id: number, actor: Character, characters: Character[], events: IActEvents) {
		this.id = id;
		this.actor = actor;
		this.characters = characters;
		this.events = events;

		// prepare actor to act
		actor.startAct();

		this.phases = {
			MOVEMENT: new MovePhase(actor, characters, this.onPhaseEvent),
			COMMAND: new CommandPhase(actor, characters, this.onPhaseEvent),
			REACTION: new ReactionPhase(actor, characters, this.onPhaseEvent),
			DIRECTION: new DirectPhase(actor, characters, this.onPhaseEvent),
			COMBAT: new CombatPhase(actor, characters, this.onPhaseEvent)
		};
	}

	public start(): void {
		const { phase, actor } = this;

		if (null !== phase) {
			throw new Error('Could not start act: invalid phase ' + phase);
		}
		this.log('Act started ' + actor.position.id);

		if (actor.status.has('DYING')) {
			// skip this Act
			this.skip();

		} else {
			// start Act
			if (actor.isAI()) {
				// inform AI Act started
				const player = actor.player as AIPlayer;
				player.onActStart();
			}

			// initialize move phase
			this.phase = 'MOVEMENT';
			this.phases.MOVEMENT.start();
		}
	}
	public selectTile(tile: Tile): void {
		const { phase } = this;

		if (!phase) {
			throw new Error('Could not select tile: invalid phase ' + phase);
		}
		this.phases[phase].selectTile(tile);
	}

	public selectCommand(commandID: string): void {
		const { phase } = this;

		if (!phase) {
			throw new Error('Could not select command: invalid phase ' + phase);
		}
		const command = this.commands.find(cmd => commandID === cmd.id);

		if (!command) {
			throw new Error('Could not select command: invalid command ' + commandID);
		}
		this.phases[phase].selectCommand(command);
	}

	public serialize(): IActSnapshot {
		const { actor, info, phase, phases, commands } = this;
		const actingChar = this.getActingCharacter();

		return {
			actor: actor.serialize(),
			phase,
			actingCharacter: (actingChar ? actingChar.serialize() : null),
			commands: commands.map(cmd => cmd.serialize()),
			info: (actingChar && actingChar.isAI() ? '' : info),
			phases: {
				MOVEMENT: phases.MOVEMENT.serialize(),
				COMMAND: phases.COMMAND.serialize(),
				REACTION: phases.REACTION.serialize(),
				COMBAT: phases.COMBAT.serialize(),
				DIRECTION: phases.DIRECTION.serialize()
			}
		};
	}

	public getRecord(): IActRecord {
		return {
			id: this.id,
			skipped: this.skipped,
			actor: this.actor.data.id,
			player: this.actor.player.id,
			movementPhase: this.phases.MOVEMENT.getRecord(),
			commandPhase: this.phases.COMMAND.getRecord(),
			reactionPhase: this.phases.REACTION.getRecord(),
			directionPhase: this.phases.DIRECTION.getRecord(),
			combatPhase: this.phases.COMBAT.getRecord()
		};
	}

	private skip(): void {
		this.skipped = true;
		this.log('Act skipped');

		this.end();
	}

	private end(): void {
		if (!this.actor.isDead()) {
			this.actor.endAct();
		}
		this.phase = null;

		// remove reactive status effects
		for (const char of this.characters) {
			for (const effect of reactiveEffects) {
				char.status.removeByID(effect);
			}
		}
		this.log('Act ended');
		this.events.onEnd(this);
	}

	private prepareCommands(): Command[] {
		const { actor, phases } = this;
		const { MOVEMENT, COMMAND, REACTION } = phases;

		switch (this.phase) {
			case 'MOVEMENT': {
				const { phase } = MOVEMENT.serialize();

				switch (phase) {
					case 'IDLE':
						// default character commands
						return getIdleCommands(actor);

					default:
						return [];
				}
			}

			case 'COMMAND': {
				const { phase, effectTargets } = COMMAND.serialize();

				switch (phase) {
					case 'IDLE':
						// default character command
						return getIdleCommands(actor);

					case 'TARGETING': {
						// confirm command
						const hasTargets = effectTargets.length > 0;
						return getSkillConfirmCommands(hasTargets);
					}

					default:
						return [];
				}
			}

			case 'REACTION': {
				const reaction = REACTION.getReaction();

				if (!reaction) {
					throw new Error('Could not get reaction commands: no reaction');
				}
				const { reactor, isSupport, isBackAttack } = reaction;
				const obstacles = this.characters.map(char => char.position);
				const canEvade = reactor.canEvade(obstacles);

				switch (reaction.phase) {
					case 'IDLE':
						return getReactiveCommands(reactor, isBackAttack, canEvade, isSupport);

					case 'EVASION':
						return getEvasiveCommands();

					default:
						return [];
				}
			}

			case 'DIRECTION':
			case 'COMBAT':
			default:
				return [];
		}
	}

	private update(): void {
		// acting character
		const char = this.getActingCharacter();

		if (!char) {
			throw new Error('Could not update Act data: invalid acting character');
		}
		this.commands = this.prepareCommands();
		this.events.onUpdate();

		if (char.isAI()) {
			const player = char.player as AIPlayer;
			player.onUpdate();
		}
	}

	private onPhaseEvent: IOnActPhaseEvent = (evt, data) => {
		const { phase, phases } = this;

		if ('BATTLE_INFO' === evt) {
			// handle battle info messages
			this.events.onBattleInfo(data as IBattleInfo);
			return;
		}
		if (!phase) {
			throw new Error('Could not process phase event: invalid phase');
		}
		const { MOVEMENT, COMMAND, REACTION, DIRECTION, COMBAT } = phases;

		this.info = phases[phase].getInfo();

		switch (phase) {
			case 'MOVEMENT':
				switch (evt) {
					case 'MOVE_SUSPENDED':
						// start command phase
						this.phase = 'COMMAND';
						COMMAND.start(data as Command);
						return;

					case 'MOVE_SELECTED':
						this.log('Moving to ' + (data as Tile).id);
						this.update();
						return;

					case 'MOVE_IDLE':
					case 'MOVE_ANIMATION':
						this.update();
						return;

					default:
						return; // do nothing
				}

			case 'COMMAND':
				switch (evt) {
					case 'COMMAND_SELECTED':
						this.log('Command selected: ' + (data as Command).title);
						this.update();
						return;

					case 'COMMAND_TARGETED':
						this.log('Command target selected ' + (data ? (data as Character).name : ''));
						this.update();
						return;

					case 'COMMAND_PASSED':
						// start direction phase
						this.log('Command passed');

						this.phase = 'DIRECTION';
						DIRECTION.start();
						return;

					case 'COMMAND_CANCELLED':
						// start move phase
						this.log('Command cancelled');

						this.phase = 'MOVEMENT';
						MOVEMENT.start();
						return;

					case 'COMMAND_DONE': {
						// start reaction phase
						this.log('Command confirmed');
						this.phase = 'REACTION';

						const targets = COMMAND.getEffectTargets();
						const command = COMMAND.getCommand();

						if (!command) {
							throw new Error('Could not start reaction: invalid command');
						}
						REACTION.start(targets, command);
						return;
					}

					default:
						return; // do nothing
				}

			case 'REACTION':
				switch (evt) {
					case 'REACTION_IDLE':
					case 'REACTION_SELECTED':
					case 'REACTION_ANIMATION':
						this.update();
						return;

					case 'REACTION_FINISHED':
						this.log('Reaction selected: ' + (data as Command).title);
						return;

					case 'REACTION_DONE': {
						const command = COMMAND.getCommand();
						const effectArea = COMMAND.getEffectArea();
						const effectTargets = COMMAND.getEffectTargets();

						if (!command || !effectArea.length || !effectTargets.length) {
							throw new Error('Could start combat phase: invalid command phase data');
						}
						this.phase = 'COMBAT';
						this.log('Combat started');

						COMBAT.start(command, effectArea, effectTargets);
						return;
					}

					default:
						return; // do nothing
				}

			case 'COMBAT':
				switch (evt) {
					case 'COMBAT_ANIMATION':
						this.update();
						return;

					case 'COMBAT_DONE':
						// start direction phase
						this.log('Combat finished');

						this.phase = 'DIRECTION';
						DIRECTION.start();
						return;

					default:
						return; // do nothing
				}

			case 'DIRECTION':
				switch (evt) {
					case 'DIRECTION_IDLE':
						this.update();
						return;

					case 'DIRECTION_SELECTED':
						// finish Act
						this.log('Direction set to ' + (data as Tile).id);
						this.end();
						return;

					default:
						return; // do nothing
				}

			default:
				return; // do nothing
		}
	}

	private getActingCharacter(): Character | null {
		const { phase } = this;
		return phase ? this.phases[phase].actor : this.actor;
	}

	private log(msg: string): void {
		const char = this.getActingCharacter();
		if (!char) {
			console.log(this);
			throw new Error('Invalid acting character');
		}
		Logger.info(`${char ? char.name : '???'} - ${msg}`);
	}
}

export default Act;
