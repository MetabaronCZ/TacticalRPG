import { formatTile } from 'modules/format';
import {
	getIdleCommands, getSkillConfirmCommands, getReactiveCommands, getEvasiveCommands
} from 'modules/battle/commands';

import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import AIPlayer from 'modules/ai/player';
import Character from 'modules/character';
import Command from 'modules/battle/command';
import { IBattleInfo } from 'modules/battle/battle-info';
import MovePhase, { MovePhaseEvents, IActMoveRecord } from 'modules/battle/act/move-phase';
import CommandPhase, { CommandPhaseEvents, IActCommandRecord } from 'modules/battle/act/command-phase';
import ReactionPhase, { ReactionPhaseEvents, IActReactionRecord } from 'modules/battle/act/reaction-phase';
import CombatPhase, { CombatPhaseEvents, IActCombatRecord } from 'modules/battle/act/combat-phase';
import DirectPhase, { DirectPhaseEvents, IActDirectRecord } from 'modules/battle/act/direct-phase';

type PhaseID = 'MOVEMENT' | 'COMMAND' | 'REACTION' | 'COMBAT' | 'DIRECTION';

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
	readonly onUpdate: (act: Act) => void;
	readonly onBattleInfo: (info: IBattleInfo) => void;
	readonly onEnd: (act: Act) => void;
}

export interface IActRecord {
	readonly id: number;
	readonly actor: string;
	readonly skipped: boolean;
	readonly movementPhase: IActMoveRecord;
	readonly commandPhase: IActCommandRecord;
	readonly reactionPhase: IActReactionRecord;
	readonly combatPhase: IActCombatRecord;
	readonly directionPhase: IActDirectRecord;
}

class Act {
	public readonly id: number;
	public readonly actor: Character;
	public readonly phases: IPhases;
	private readonly events: IActEvents;
	private readonly characters: Character[];

	private phase: PhaseID | null = null;
	private skipped: boolean = false;
	private commands: Command[] = [];
	private info: string = '';

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

	public getPhase(): PhaseID | null {
		return this.phase;
	}

	public getCommands(): Command[] {
		return [...this.commands];
	}

	public getActingCharacter(): Character | null {
		const { actor, phase, phases } = this;

		if (!phase) {
			return actor;
		}
		return phases[phase].actor;
	}

	public getInfo(): string {
		return this.info;
	}

	public start() {
		const { phase, actor } = this;

		if (phase) {
			throw new Error('Could not start act: invalid phase ' + phase);
		}
		this.log('Act started');

		if (actor.status.has('DYING')) {
			// skip this Act
			this.skip();

		} else {
			// start move phase
			this.phase = 'MOVEMENT';
			this.phases.MOVEMENT.start();
		}
	}
	public selectTile(tile: Tile) {
		const { phase } = this;

		if (!phase) {
			throw new Error('Could not select tile: invalid phase ' + phase);
		}
		this.phases[phase].selectTile(tile);
	}

	public selectCommand(command: Command) {
		const { phase } = this;

		if (!phase) {
			throw new Error('Could not select command: invalid phase ' + phase);
		}
		this.phases[phase].selectCommand(command);
	}

	public serialize(): IActRecord {
		return {
			id: this.id,
			skipped: this.skipped,
			actor: this.actor.data.id,
			movementPhase: this.phases.MOVEMENT.serialize(),
			commandPhase: this.phases.COMMAND.serialize(),
			reactionPhase: this.phases.REACTION.serialize(),
			directionPhase: this.phases.DIRECTION.serialize(),
			combatPhase: this.phases.COMBAT.serialize()
		};
	}

	private skip() {
		this.skipped = true;
		this.log('Act skipped');

		this.end();
	}

	private end() {
		if (!this.actor.isDead()) {
			this.actor.endAct();
		}
		this.phase = null;
		this.log('Act ended');

		this.events.onEnd(this);
	}

	private prepareCommands(): Command[] {
		const { actor, phases } = this;
		const { MOVEMENT, COMMAND, REACTION } = phases;

		switch (this.phase) {
			case 'MOVEMENT':
				switch (MOVEMENT.getPhase()) {
					case 'IDLE':
						// default character commands
						return getIdleCommands(actor);

					default:
						return [];
				}

			case 'COMMAND':
				switch (COMMAND.getPhase()) {
					case 'IDLE':
						// default character command
						return getIdleCommands(actor);

					case 'TARGETING':
						// confirm command
						const hasTargets = COMMAND.getEffectTargets().length > 0;
						return getSkillConfirmCommands(hasTargets);

					default:
						return [];
				}

			case 'REACTION':
				const reaction = REACTION.getReaction();

				if (!reaction) {
					throw new Error('Could not get reaction commands: no reaction');
				}
				const { reactor, combat } = reaction;
				const obstacles = this.characters.map(char => char.position);
				const canEvade = reactor.canEvade(obstacles);
				const isSupport = !!combat.find(dmg => 'SUPPORT' === dmg.type);

				switch (reaction.phase) {
					case 'IDLE':
						return getReactiveCommands(reactor, combat[0].backAttack, canEvade, isSupport);

					case 'EVASION':
						return getEvasiveCommands();

					default:
						return [];
				}

			case 'DIRECTION':
			case 'COMBAT':
			default:
				return [];
		}
	}

	private update() {
		const char = this.getActingCharacter();

		if (!char) {
			throw new Error('Could not update Act data: invalid acting character');
		}
		const commands = this.prepareCommands();

		if (!char.isAI()) {
			// set commands for player
			this.commands = commands;
			this.events.onUpdate(this);

		} else {
			// let AI act
			this.commands = [];
			this.events.onUpdate(this);

			const player = char.player as AIPlayer;
			player.update(this, commands);
		}
	}

	private onPhaseEvent: IOnActPhaseEvent = (evt, data) => {
		const { phase, phases } = this;

		if ('BATTLE_INFO' === evt) {
			// handle battle info messages
			this.events.onBattleInfo(data as IBattleInfo);
			return;
		}
		const { MOVEMENT, COMMAND, REACTION, DIRECTION, COMBAT } = phases;

		switch (phase) {
			case 'MOVEMENT':
				switch (evt) {
					case 'MOVE_SUSPENDED':
						// start command phase
						this.phase = 'COMMAND';
						COMMAND.start(data as Command);
						return;

					case 'MOVE_IDLE':
						this.info = 'Move on grid or select a command:';
						this.update();
						return;

					case 'MOVE_SELECTED':
						this.info = 'Moving ...';
						this.log('Moving to ' + formatTile(data as Tile));
						this.update();
						return;

					case 'MOVE_ANIMATION':
						this.update();
						return;

					default:
						return; // do nothing
				}

			case 'COMMAND':
				switch (evt) {
					case 'COMMAND_SELECTED':
						this.info = 'Select command target on grid.';
						this.log('Command selected: ' + (data as Command).title);
						this.update();
						return;

					case 'COMMAND_TARGETED':
						this.info = '';
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

					case 'COMMAND_DONE':
						// start reaction phase
						this.log('Command confirmed');

						this.phase = 'REACTION';
						REACTION.start(COMMAND.getCombatInfo());
						return;

					default:
						return; // do nothing
				}

			case 'REACTION':
				switch (evt) {
					case 'REACTION_IDLE':
						this.info = 'Select reaction:';
						this.update();
						return;

					case 'REACTION_EVADING':
						this.info = 'Select evasion target on grid.';
						this.update();
						return;

					case 'REACTION_FINISHED':
						this.log('Reaction selected: ' + (data as Command).title);
						return;

					case 'REACTION_DONE':
						const command = COMMAND.getCommand();
						const effectArea = COMMAND.getEffectArea();
						const targets = COMMAND.getEffectTargets();

						if (!command || !effectArea.length || !targets.length) {
							throw new Error('Could start combat phase: invalid command phase data');
						}
						this.phase = 'COMBAT';
						this.info = 'Combat in progress...';
						this.log(this.info);
						COMBAT.start(command, effectArea, targets);
						return;

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
						this.info = 'Select new direction on grid.';
						this.update();
						return;

					case 'DIRECTION_SELECTED':
						// finish Act
						this.info = '';
						this.log('Direction set to ' + formatTile(data as Tile));
						this.end();
						return;

					default:
						return; // do nothing
				}

			default:
				return; // do nothing
		}
	}

	private log(msg: string) {
		const char = this.getActingCharacter();
		Logger.info(`${char ? char.name : '???'} - ${msg}`);
	}
}

export default Act;
