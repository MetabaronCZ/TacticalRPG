import { getContinueCommand } from 'modules/battle/commands';
import { resolveDirection } from 'modules/geometry/direction';

import Skill from 'modules/skill';
import Tile from 'modules/geometry/tile';
import ActPhase from 'modules/battle/act/phase';
import { IOnActPhaseEvent } from 'modules/battle/act';
import Character, { ICharacter } from 'modules/character';
import MoveAnimation from 'modules/battle/act/move-animation';
import { StatusEffectID } from 'modules/battle/status-effect';
import Command, { ICommandRecord } from 'modules/battle/command';

const txtIdle = 'Select reaction:';
const txtEvasion = 'Select evasion target on grid.';

export interface IReactionPhaseState {
	readonly phase: ReactionPhaseID;
	readonly reaction: IReactionState | null;
	readonly reactions: IReactionState[];
}

export interface IReactionPhaseRecord {
	reactions: Array<{
		readonly reactor: string;
		readonly command: ICommandRecord | null;
		readonly evasionTarget: string | null;
	}>;
}

interface IReactionState {
	readonly reactor: ICharacter;
	readonly phase: ActiveReactionPhaseID;
	readonly command: Command | null;
	readonly evasible: Tile[];
	readonly evasionTarget: Tile | null;
}

export type ReactionPhaseID = 'SUSPENDED' | 'IDLE' | 'DONE';
export type ActiveReactionPhaseID  = 'SUSPENDED' | 'IDLE' | 'EVASION';

export type ReactionPhaseEvents =
	'REACTION_IDLE' |
	'REACTION_EVADING' |
	'REACTION_FINISHED' |
	'REACTION_DONE';

interface IReaction {
	readonly reactor: Character;
	readonly isSupport: boolean;
	phase: ActiveReactionPhaseID;
	command: Command | null;
	evasible: Tile[];
	evasionTarget: Tile | null;
}

class ReactionPhase extends ActPhase<IReactionPhaseState, IReactionPhaseRecord> {
	public get actor(): Character | null {
		const reaction = this.getReaction();
		return reaction ? reaction.reactor : null;
	}
	private phase: ReactionPhaseID = 'SUSPENDED';
	private reaction = 0; // active reaction index
	private reactions: IReaction[] = [];

	private actActor: Character;
	private readonly characters: Character[];
	private readonly onEvent: IOnActPhaseEvent;

	constructor(actor: Character, characters: Character[], onEvent: IOnActPhaseEvent) {
		super();
		this.actActor = actor;
		this.onEvent = onEvent;
		this.characters = characters;
	}

	public selectTile(tile: Tile): void {
		const reaction = this.getReaction();

		if (!reaction) {
			return;
		}
		if ('EVASION' === reaction.phase) {
			this.setEvasionTarget(reaction, tile);
		}
	}

	public selectCommand(command: Command): void {
		if (!command.isActive()) {
			throw new Error('Could not select reaction: command not active');
		}
		const reaction = this.getReaction();

		if (!reaction) {
			return;
		}
		switch (reaction.phase) {
			case 'IDLE':
				switch (command.type) {
					case 'REACTION':
						this.react(reaction, command);
						return;

					case 'DONT_REACT':
						this.pass(reaction, command);
						return;

					default:
						return; // do nothing
				}

			case 'EVASION':
				if ('BACK' === command.type) {
					this.cancelEvasion(reaction);
				}
				return;

			case 'SUSPENDED':
			default:
				return; // do nothing
		}
	}

	public start(targets: Character[], command: Command): void {
		const { phase } = this;

		if ('SUSPENDED' !== phase) {
			throw new Error('Could not start reaction: invalid phase ' + phase);
		}

		if (!targets.length) {
			throw new Error('Could not start reaction: no reactors');
		}
		this.phase = 'IDLE';

		this.reactions = targets.map(target => ({
			phase: 'SUSPENDED',
			isSupport: command.isSupport,
			reactor: target,
			command: null,
			evasible: [],
			evasionTarget: null
		}));

		this.startReact();
	}

	public getReaction(): IReaction | null {
		return this.reactions[this.reaction] || null;
	}

	public getState(): IReactionPhaseState {
		const reaction = this.getReaction();
		return {
			phase: this.phase,
			reaction: (reaction ? this.serializeReaction(reaction) : null),
			reactions: this.reactions.map(r => this.serializeReaction(r))
		};
	}

	public getRecord(): IReactionPhaseRecord {
		return {
			reactions: this.reactions.map(({ reactor, command, evasionTarget }) => {
				const reaction = {
					reactor: reactor.data.id,
					command: command
						? {
							title: command.title,
							skills: command.skills.map(skill => skill.id)
						}
						: null
					,
					evasionTarget: (evasionTarget ? evasionTarget.id : null)
				};
				return reaction;
			})
		};
	}

	private serializeReaction(reaction: IReaction): IReactionState {
		return {
			reactor: reaction.reactor.serialize(),
			phase: reaction.phase,
			command: reaction.command,
			evasible: reaction.evasible,
			evasionTarget: reaction.evasionTarget
		};
	}

	private startReact(): void {
		const { actActor, phase } = this;

		if ('IDLE' !== phase) {
			throw new Error('Could not start reaction: invalid phase ' + phase);
		}
		const reaction = this.getReaction();

		if (!reaction) {
			// all targets have reacted
			this.phase = 'DONE';
			this.info = '';

			this.onEvent('REACTION_DONE');
			return;
		}
		reaction.phase = 'IDLE';

		// turn actor to face active reactor
		actActor.direction = resolveDirection(actActor.position, reaction.reactor.position);

		if (reaction.isSupport) {
			// force reaction pass
			const passAction = getContinueCommand();
			this.pass(reaction, passAction);

		} else {
			// wait for reaction selection
			this.info = txtIdle;
			this.onEvent('REACTION_IDLE');
		}
	}

	private react(reaction: IReaction, command: Command): void {
		const { phase } = reaction;

		if ('IDLE' !== phase) {
			throw new Error('Could not set reaction: invalid phase ' + phase);
		}
		if (!command.isActive() || !command.skills.length) {
			throw new Error('Could not react: invalid command');
		}
		reaction.command = command;

		const skill = command.skills[0];

		switch (skill.id) {
			case 'ENERGY_SHIELD':
				this.apply(reaction, skill, 'ENERGY_SHIELD');
				return;

			case 'SHD_SMALL_BLOCK':
				this.apply(reaction, skill, 'BLOCK_SMALL');
				return;

			case 'SHD_LARGE_BLOCK':
				this.apply(reaction, skill, 'BLOCK_LARGE');
				return;

			case 'EVADE':
				this.startEvasion(reaction);
				return;

			default:
				return; // do nothing
		}
	}

	private apply(reaction: IReaction, skill: Skill, effect: StatusEffectID): void {
		const { reactor, phase } = reaction;

		if ('IDLE' !== phase) {
			throw new Error('Could not react: invalid state ' + phase);
		}
		reactor.status.apply(skill, effect);
		this.finish(reaction);
	}

	private cancelEvasion(reaction: IReaction): void {
		const { phase } = reaction;

		if ('EVASION' !== phase) {
			throw new Error('Could not cancel evasion: invalid phase ' + phase);
		}
		reaction.phase = 'IDLE';
		this.info = txtIdle;

		reaction.command = null;
		reaction.evasible = [];

		this.onEvent('REACTION_IDLE');
	}

	private pass(reaction: IReaction, command: Command): void {
		const { phase } = reaction;

		if ('IDLE' !== phase) {
			throw new Error('Could not pass reaction: invalid phase ' + phase);
		}
		reaction.command = command;
		this.finish(reaction);
	}

	private startEvasion(reaction: IReaction): void {
		const { characters } = this;
		const { reactor, phase } = reaction;

		if ('IDLE' !== phase) {
			throw new Error('Could not start evasion: invalid phase ' + phase);
		}
		reaction.phase = 'EVASION';
		this.info = txtEvasion;

		const obstacles = characters.map(char => char.position);
		reaction.evasible = reactor.position.getNeighbours(obstacles);

		this.onEvent('REACTION_EVADING');
	}

	private setEvasionTarget(reaction: IReaction, tile: Tile): void {
		const { command, reactor, phase, evasible } = reaction;

		if ('EVASION' !== phase) {
			throw new Error('Could not set evasion target: invalid phase ' + phase);
		}

		if (!command) {
			throw new Error('Could not set evasion target: invalid command');
		}

		if (!tile.isContained(evasible)) {
			// invalid tile selected
			return;
		}
		reaction.evasionTarget = tile;

		const skill = command.skills[0];

		// update reacting character
		const { AP } = reactor.attributes;
		const newAp = AP - skill.apCost;

		if (newAp < 0) {
			throw new Error('Could not evade: could not afford to use skill');
		}

		// animate evasion
		const moveAnim = new MoveAnimation(
			reactor,
			tile,
			() => this.onEvent('REACTION_EVADING'),
			() => {
				reactor.attributes.set('AP', newAp);
				this.finish(reaction);
			}
		);

		moveAnim.start();
	}

	private finish(reaction: IReaction): void {
		this.onEvent('REACTION_FINISHED', reaction.command);

		this.reaction++;
		this.startReact();
	}
}

export default ReactionPhase;
