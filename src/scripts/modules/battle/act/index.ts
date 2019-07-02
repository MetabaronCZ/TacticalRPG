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
import MovePhase, { MovePhaseEvents, IActMoveRecord } from 'modules/battle/act/move-phase';
import ActionPhase, { ActionPhaseEvents, IActActionRecord } from 'modules/battle/act/action-phase';
import ReactionPhase, { ReactionPhaseEvents, IActReactionRecord } from 'modules/battle/act/reaction-phase';
import CombatPhase, { CombatPhaseEvents, IActCombatRecord } from 'modules/battle/act/combat-phase';
import DirectPhase, { DirectPhaseEvents, IActDirectRecord } from 'modules/battle/act/direct-phase';

type PhaseID = 'MOVEMENT' | 'ACTION' | 'REACTION' | 'COMBAT' | 'DIRECTION';

interface IPhases {
	MOVEMENT: MovePhase;
	ACTION: ActionPhase;
	REACTION: ReactionPhase;
	DIRECTION: DirectPhase;
	COMBAT: CombatPhase;
}

export type ActPhaseEvent = 'BATTLE_INFO' | MovePhaseEvents | ActionPhaseEvents | ReactionPhaseEvents | CombatPhaseEvents | DirectPhaseEvents;
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
	readonly movementPhase: IActMoveRecord;
	readonly actionPhase: IActActionRecord;
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
	private actions: CharacterAction[] = [];

	constructor(id: number, actor: Character, characters: Character[], events: IActEvents) {
		this.id = id;
		this.actor = actor;
		this.characters = characters;
		this.events = this.prepareEvents(events);

		// prepare actor to act
		actor.startAct();

		this.phases = {
			MOVEMENT: new MovePhase(actor, characters, this.onPhaseEvent),
			ACTION: new ActionPhase(actor, characters, this.onPhaseEvent),
			REACTION: new ReactionPhase(actor, characters, this.onPhaseEvent),
			DIRECTION: new DirectPhase(actor, characters, this.onPhaseEvent),
			COMBAT: new CombatPhase(actor, characters, this.onPhaseEvent)
		};

		this.events.onStart(this);

		setTimeout(() => { // prevent race condition
			if (actor.status.has('DYING')) {
				// skip this Act
				this.skip();

			} else {
				// start move phase
				this.phase = 'MOVEMENT';
				this.phases.MOVEMENT.start();
			}
		});
	}

	public getPhase(): PhaseID | null {
		return this.phase;
	}

	public getActions(): CharacterAction[] {
		return this.actions;
	}

	public getActingCharacter(): Character | null {
		const { actor, phase, phases } = this;

		if (null === phase) {
			return actor;
		}
		return phases[phase].getActor();
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
			movementPhase: this.phases.MOVEMENT.serialize(),
			actionPhase: this.phases.ACTION.serialize(),
			reactionPhase: this.phases.REACTION.serialize(),
			directionPhase: this.phases.DIRECTION.serialize(),
			combatPhase: this.phases.COMBAT.serialize()
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
		const { MOVEMENT, ACTION, REACTION } = phases;

		switch (this.phase) {
			case 'MOVEMENT':
				switch (MOVEMENT.getPhase()) {
					case 'IDLE':
						// default character actions
						return getIdleActions(actor);

					default:
						return [];
				}

			case 'ACTION':
				switch (ACTION.getPhase()) {
					case 'IDLE':
						// default character actions
						return getIdleActions(actor);

					case 'TARGETING':
						// confirm actions
						const action = ACTION.getAction();
						const hasTargets = ACTION.getEffectTargets().length > 0;

						if (null === action) {
							throw new Error('Could not get actions: no active action');
						}
						return getSkillConfirmActions(action, hasTargets);

					default:
						return [];
				}

			case 'REACTION':
				const reaction = REACTION.getReaction();

				if (null === reaction) {
					throw new Error('Could not get reaction actions: no reaction');
				}
				const { reactor, combat } = reaction;
				const obstacles = this.characters.map(char => char.position);
				const canEvade = reactor.canEvade(obstacles);

				switch (reaction.phase) {
					case 'IDLE':
						return getReactiveActions(reactor, combat.attack.backAttack, canEvade);

					case 'EVASION':
						return getEvasiveActions();

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
		let char = this.getActingCharacter();

		if (null === char) {
			throw new Error('Could not update Act data: invalid acting character');
		}
		const actions = this.prepareActions();

		if (!char.isAI()) {
			// set actions for player
			this.actions = actions;
		}
		this.events.onUpdate(this);

		setTimeout(() => { // prevent race condition
			char = this.getActingCharacter();

			if (null === char) {
				throw new Error('Could not update Act data: invalid acting character');
			}
			if (char.isAI()) {
				// let AI act
				const player = char.player as AIPlayer;
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
		const { MOVEMENT, ACTION, REACTION, DIRECTION, COMBAT } = phases;

		switch (phase) {
			case 'MOVEMENT':
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

					case 'ACTION_PASSED':
						// start direction phase
						this.log('Action passed');

						this.phase = 'DIRECTION';
						DIRECTION.start();
						return;

					case 'ACTION_CANCELLED':
						// start move phase
						this.log('Action cancelled');

						this.phase = 'MOVEMENT';
						MOVEMENT.start();
						return;

					case 'ACTION_DONE':
						// start reaction phase
						this.log('Action confirmed');

						this.phase = 'REACTION';
						REACTION.start(ACTION.getCombatInfo());
						return;

					default:
						return; // do nothing
				}

			case 'REACTION':
				switch (evt) {
					case 'REACTION_IDLE':
						this.log('Select reaction...');
						this.update();
						return;

					case 'REACTION_EVADING':
						this.log('Select evasion target...');
						this.update();
						return;

					case 'REACTION_FINISHED':
						this.log('Reaction selected: ' + (data as CharacterAction).title);
						return;

					case 'REACTION_DONE':
						const action = ACTION.getAction();
						const effectArea = ACTION.getEffectArea();
						const targets = ACTION.getEffectTargets();

						if (!action || !effectArea.length || !targets.length) {
							throw new Error('Could start combat phase: invalid action phase data');
						}
						this.phase = 'COMBAT';
						this.log('Combat begins...');
						COMBAT.start(action, effectArea, targets);
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

	private log(msg: string) {
		const char = this.getActingCharacter();
		Logger.info(`${char ? char.name : '???'} - ${msg}`);
	}
}

export default Act;
