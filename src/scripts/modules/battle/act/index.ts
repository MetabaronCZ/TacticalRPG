import { formatTile } from 'modules/format';
import {
	getIdleActions, getSkillConfirmActions, getReactiveActions, getEvasiveActions
} from 'modules/battle/character-actions';

import Logger from 'modules/logger';
import Tile from 'modules/geometry/tile';
import AIPlayer from 'modules/ai/player';
import Character from 'modules/character';
import { IBattleInfo } from 'modules/battle/battle-info';
import CharacterAction from 'modules/battle/character-action';
import { ReactionPhaseEvents } from 'modules/battle/act/reaction-phase';
import MovePhase, { MovePhaseEvents, IActMoveRecord } from 'modules/battle/act/move-phase';
import ActionPhase, { IActActionRecord, ActionPhaseEvents } from 'modules/battle/act/action-phase';
import DirectPhase, { IActDirectRecord, DirectPhaseEvents } from 'modules/battle/act/direct-phase';

type PhaseID = 'MOVE' | 'ACTION' | 'DIRECTION';

interface IPhases {
	MOVE: MovePhase;
	ACTION: ActionPhase;
	DIRECTION: DirectPhase;
}

export type ActPhaseEvent = 'BATTLE_INFO' | MovePhaseEvents | ActionPhaseEvents | ReactionPhaseEvents | DirectPhaseEvents;
export type IOnActPhaseEvent = (event: ActPhaseEvent, data?: Character | CharacterAction | Tile | IBattleInfo | null) => void;

export interface IActEvents {
	onStart: (act: Act) => void;
	onUpdate: (act: Act) => void;
	onSkip: (act: Act) => void;
	onEnd: (act: Act) => void;
	onBattleInfo: (info: IBattleInfo) => void;
}

export interface IActRecord {
	readonly id: number;
	readonly actor: string;
	readonly skipped: boolean;
	readonly movePhase: IActMoveRecord;
	readonly actionPhase: IActActionRecord;
	readonly directPhase: IActDirectRecord;
}

class Act {
	public readonly id: number;
	public readonly actor: Character;
	public readonly phases: IPhases;
	private readonly events: IActEvents;
	private readonly characters: Character[];

	private phase: PhaseID | null = null;
	private skipped: boolean = false;
	private actions: CharacterAction[] = [];

	constructor(id: number, actor: Character, characters: Character[], events: IActEvents) {
		this.id = id;
		this.actor = actor;
		this.characters = characters;
		this.events = this.prepareEvents(events);

		// prepare actor to act
		actor.startAct();

		this.phases = {
			MOVE: new MovePhase(actor, characters, this.onPhaseEvent),
			ACTION: new ActionPhase(actor, characters, this.onPhaseEvent),
			DIRECTION: new DirectPhase(actor, characters, this.onPhaseEvent)
		};

		this.events.onStart(this);

		setTimeout(() => { // prevent race condition
			if (actor.status.has('DYING')) {
				// skip this Act
				this.skip();

			} else {
				// start move phase
				this.phase = 'MOVE';
				this.phases.MOVE.start();
			}
		});
	}

	public getPhase(): PhaseID | null {
		return this.phase;
	}

	public getActingCharacter(): Character {
		const { actor, phase, phases } = this;
		const reaction = phases.ACTION.getReaction();
		return ('ACTION' === phase && reaction ? reaction.reactor : actor);
	}

	public getActions(): CharacterAction[] {
		return this.actions;
	}

	public selectTile(tile: Tile) {
		const { phase } = this;

		if (null === phase) {
			throw new Error('Could not select tile: invalid phase ' + phase);
		}
		this.phases[phase].selectTile(tile);
	}

	public selectAction(action: CharacterAction) {
		const { phase } = this;

		if (null === phase) {
			throw new Error('Could not select action: invalid phase ' + phase);
		}
		this.phases[phase].selectAction(action);
	}

	public serialize(): IActRecord {
		return {
			id: this.id,
			skipped: this.skipped,
			actor: this.actor.data.id,
			movePhase: this.phases.MOVE.serialize(),
			actionPhase: this.phases.ACTION.serialize(),
			directPhase: this.phases.DIRECTION.serialize()
		};
	}

	private skip() {
		this.skipped = true;
		this.events.onSkip(this);

		setTimeout(() => { // prevent race condition
			this.end();
		});
	}

	private end() {
		if (!this.actor.isDead()) {
			this.actor.endAct();
		}
		this.phase = null;
		this.events.onEnd(this);
	}

	private prepareActions(): CharacterAction[] {
		const { actor, phases } = this;

		switch (this.phase) {
			case 'MOVE':
				switch (phases.MOVE.getPhase()) {
					case 'IDLE':
						// default character actions
						return getIdleActions(actor);

					default:
						return [];
				}

			case 'ACTION':
				switch (phases.ACTION.getPhase()) {
					case 'IDLE':
						// default character actions
						return getIdleActions(actor);

					case 'TARGETING':
						// confirm actions
						const action = phases.ACTION.getAction();
						const hasTargets = phases.ACTION.getEffectTargets().length > 0;

						if (null === action) {
							throw new Error('Could not get actions: no active action');
						}
						return getSkillConfirmActions(action, hasTargets);

					case 'REACTING':
						// reaction actions
						const reaction = phases.ACTION.getReaction();

						if (null === reaction) {
							throw new Error('Could not get reaction actions: no reaction');
						}
						const { reactor, backAttacked } = reaction;
						const obstacles = this.characters.map(char => char.position);
						const canEvade = reactor.canEvade(obstacles);

						switch (reaction.getPhase()) {
							case 'IDLE':
								return getReactiveActions(reactor, backAttacked, canEvade);

							case 'EVASION':
								return getEvasiveActions();

							default:
								return [];
						}

					default:
						return [];
				}

			case 'DIRECTION':
			default:
				return [];
		}
	}

	private update() {
		let actingCharacter = this.getActingCharacter();
		const actions = this.prepareActions();

		if (!actingCharacter.isAI()) {
			// set actions for player
			this.actions = actions;
		}
		this.events.onUpdate(this);

		setTimeout(() => { // prevent race condition
			actingCharacter = this.getActingCharacter();

			if (actingCharacter.isAI()) {
				const player = actingCharacter.player as AIPlayer;
				player.act(this, actions);
			}
		});
	}

	private onPhaseEvent: IOnActPhaseEvent = (evt, data) => {
		const { phase, phases } = this;

		if ('BATTLE_INFO' === evt) {
			// handle battle info messages
			this.events.onBattleInfo(data as IBattleInfo);
			return;
		}
		const { MOVE, ACTION, DIRECTION } = phases;

		switch (phase) {
			case 'MOVE':
				switch (evt) {
					case 'MOVE_SUSPENDED':
						// start action phase
						this.phase = 'ACTION';
						ACTION.start(data as CharacterAction);
						return;

					case 'MOVE_IDLE':
						this.log('Select move target or an action...');
						this.update();
						return;

					case 'MOVE_SELECTED':
						this.log('Moving to ' + formatTile(data as Tile));
						this.update();
						return;

					case 'MOVE_ANIMATION':
						this.update();
						return;

					default:
						return; // do nothing
				}

			case 'ACTION':
				switch (ACTION.getPhase()) {
					case 'REACTING':
						// handle reaction events
						const reaction = ACTION.getReaction();

						if (!reaction) {
							throw new Error('Invalid action data: no reaction');
						}
						const { reactor } = reaction;

						switch (evt) {
							case 'REACTION_IDLE':
								this.log('Select reaction...', reactor);
								this.update();
								return;

							case 'REACTION_EVADING':
								this.log('Select evasion target...', reactor);
								this.update();
								return;

							case 'REACTION_FINISHED':
								this.log('Reaction selected: ' + (data as CharacterAction).title, reactor);
								this.update();
								return;

							default:
								return; // do nothing
						}

					default:
						// handle default action events
						switch (evt) {
							case 'ACTION_SELECTED':
								this.log('Action selected: ' + (data as CharacterAction).title);
								this.log('Select action target...');
								this.update();
								return;

							case 'ACTION_TARGETED':
								this.log('Action target selected ' + (data ? (data as Character).name : ''));
								this.update();
								return;

							case 'ACTION_ANIMATION':
								this.update();
								return;

							case 'ACTION_PASSED':
								this.log('Action passed');
							case 'ACTION_DONE':
								// start direction phase
								this.phase = 'DIRECTION';
								DIRECTION.start();
								return;

							case 'ACTION_CANCELLED':
								// start move phase
								this.phase = 'MOVE';
								this.log('Action cancelled');
								MOVE.start();
								return;

							default:
								return; // do nothing
						}
				}

			case 'DIRECTION':
				switch (evt) {
					case 'DIRECTION_IDLE':
						this.log('Select direction target...');
						this.update();
						return;

					case 'DIRECTION_SELECTED':
						// finish Act
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

	private prepareEvents(events: IActEvents): IActEvents {
		return {
			onStart: act => {
				this.log('Act started');
				events.onStart(act);
			},
			onUpdate: events.onUpdate,
			onSkip: act => {
				this.log('Act skipped');
				events.onSkip(act);
			},
			onEnd: act => {
				this.log('Act ended');
				events.onEnd(act);
			},
			onBattleInfo: events.onBattleInfo
		};
	}

	private log(msg: string, character = this.actor) {
		Logger.info(`${character.name} - ${msg}`);
	}
}

export default Act;
